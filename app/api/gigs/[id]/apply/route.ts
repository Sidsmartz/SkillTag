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
  status: 'applied' | 'shortlisted' | 'selected' | 'completed';
  appliedAt: Date;
  bookmarked: boolean;
  boosted: boolean;
}

interface StudentApplication {
  _id: ObjectId;
  gig: {
    _id: ObjectId;
    title: string;
    company?: string;
    duration?: string;
    stipend?: string;
    location?: string;
    deadline?: string;
  };
  status: 'applied' | 'shortlisted' | 'selected' | 'completed';
  appliedAt: Date;
  bookmarked: boolean;
  boosted: boolean;
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
  duration?: string;
  stipend?: string;
  location?: string;
  applicationDeadline?: string;
  applicants?: Applicant[];
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

    // Check if already applied by looking in student's applications array
    const hasAlreadyApplied = mutableStudent.applications?.some(
      (app: any) => app.gig._id.toString() === gig._id.toString()
    );

    if (hasAlreadyApplied) {
      return NextResponse.json(
        { error: 'You have already applied to this gig' },
        { status: 400 }
      );
    }

    // Create application ID
    const applicationId = new ObjectId();

    // Create application object for student
    const studentApplication: StudentApplication = {
      _id: applicationId,
      gig: {
        _id: gig._id,
        title: gig.gigTitle,
        company: gig.company,
        duration: gig.duration,
        stipend: gig.stipend,
        location: gig.location,
        deadline: gig.applicationDeadline
      },
      status: 'applied',
      appliedAt: new Date(),
      bookmarked: false,
      boosted: false
    };

    // Create applicant object for gig
    const gigApplicant: Applicant = {
      _id: applicationId,
      student: {
        _id: mutableStudent._id,
        name: mutableStudent.name,
        email: mutableStudent.email
      },
      status: 'applied',
      appliedAt: new Date(),
      bookmarked: false,
      boosted: false
    };

    // Update student's applications array
    await db.collection('students').updateOne(
      { _id: mutableStudent._id },
      {
        $push: { applications: studentApplication },
        $set: { updatedAt: new Date() }
      } as any
    );

    // Update gig's applicants array
    await db.collection('jobs').updateOne(
      { _id: gig._id },
      {
        $push: { applicants: gigApplicant }
      } as any
    );

    return NextResponse.json({ success: true, message: 'Successfully applied to gig' });
  } catch (error) {
    console.error('Error applying to gig:', error);
    return NextResponse.json(
      { error: 'Failed to apply to gig' },
      { status: 500 }
    );
  }
}
