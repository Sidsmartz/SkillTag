import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId, WithId, Document } from 'mongodb';
import { authOptions } from '@/lib/authOptions';

interface Applicant {
  _id: ObjectId;
  student: {
    _id: ObjectId;
    name: string;
    email: string;
  };
  status: string;
  appliedAt: Date;
}

interface StudentApplication {
    _id: ObjectId;
    gig: {
        _id: ObjectId;
        title: string;
        company?: string;
    };
    status: string;
    appliedAt: Date;
}

interface Student extends WithId<Document> {
  _id: ObjectId;
  name: string;
  email: string;
  applications?: StudentApplication[];
}

interface Gig extends WithId<Document> {
  _id: ObjectId;
  gigTitle: string;
  company?: string;
  applicants?: Applicant[];
}

interface Application extends WithId<Document> {
  _id: ObjectId;
  student: {
    _id: ObjectId;
    name: string;
    email: string;
  };
  gig: {
    _id: ObjectId;
    title: string;
    company?: string;
  };
  status: string;
  appliedAt: Date;
  updatedAt: Date;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Find the student by email
    const student = await db.collection<Student>('students').findOne({ email: session.user.email });
    let mutableStudent = student;
    if (!mutableStudent) {
      // Create student document if it doesn't exist
      const insertResult = await db.collection('students').insertOne({
        email: session.user.email,
        name: session.user.name || 'Unnamed',
        applications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mutableStudent = {
        _id: insertResult.insertedId,
        email: session.user.email,
        name: session.user.name || 'Unnamed',
        applications: [],
      } as any;
    }

    const { id } = await Promise.resolve(params);
    const gig = await db.collection<Gig>('jobs').findOne({ _id: new ObjectId(id) });
    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await db.collection<Application>('applications').findOne({
      'student._id': mutableStudent._id,
      'gig._id': gig._id
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this gig' },
        { status: 400 }
      );
    }

    // Create new application
    const application = {
      student: {
        _id: mutableStudent._id,
        name: mutableStudent.name,
        email: mutableStudent.email
      },
      gig: {
        _id: gig._id,
        title: gig.gigTitle,
        company: gig.company
      },
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the application
    const result = await db.collection('applications').insertOne(application);
    const applicationId = result.insertedId;

    // Update gig's applicants array
    await db.collection<Gig>('jobs').updateOne(
      { _id: gig._id },
      {
        $push: {
          applicants: {
            _id: applicationId,
            student: {
              _id: student._id,
              name: student.name,
              email: student.email
            },
            status: 'pending',
            appliedAt: new Date()
          }
        } as any
      }
    );

    // Update student's applications array
    await db.collection('students').updateOne(
      { _id: mutableStudent._id },
      {
        $push: {
          applications: {
            _id: applicationId,
            gig: {
              _id: gig._id,
              title: gig.gigTitle,
              company: gig.company
            },
            status: 'pending',
            appliedAt: new Date()
          }
        } as any
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error applying to gig:', error);
    return NextResponse.json(
      { error: 'Failed to apply to gig' },
      { status: 500 }
    );
  }
}
