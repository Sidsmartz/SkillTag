import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const { id } = await Promise.resolve(params);
    const applicationId = new ObjectId(id);

    // Find the student by email
    const student = await db.collection('students').findOne({ email: session.user.email });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Find the application in student's applications array
    const application = student.applications?.find((app: any) => app._id.toString() === applicationId.toString());
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Toggle the bookmarked flag
    const newBookmarkedValue = !application.bookmarked;

    // Update the application in student's applications array
    await db.collection('students').updateOne(
      { 
        email: session.user.email,
        'applications._id': applicationId
      },
      {
        $set: { 
          'applications.$.bookmarked': newBookmarkedValue,
          updatedAt: new Date()
        }
      } as any
    );

    // Also update the corresponding applicant in the gig's applicants array
    await db.collection('jobs').updateOne(
      { 
        'applicants._id': applicationId
      },
      {
        $set: { 
          'applicants.$.bookmarked': newBookmarkedValue
        }
      } as any
    );

    return NextResponse.json({ 
      success: true, 
      bookmarked: newBookmarkedValue,
      message: newBookmarkedValue ? 'Application bookmarked' : 'Bookmark removed'
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}
