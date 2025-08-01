import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    // Get the current user's session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the student document
    const student = await db.collection('students').findOne({ email: session.user.email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch applications linked to this student
    const applicationsCursor = db.collection('applications').find({ 'student._id': student._id });
    const applicationDocs = await applicationsCursor.toArray();

    const applications = applicationDocs.map(app => ({
      id: (app._id as ObjectId).toString(),
      status: app.status,
      appliedAt: app.appliedAt,
      gig: {
        id: (app.gig._id as ObjectId).toString(),
        title: app.gig.gigTitle,
        company: app.gig.company,
        duration: app.gig.duration,
        stipend: app.gig.stipend,
        location: app.gig.location,
        deadline: app.gig.applicationDeadline
      }
    }));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
