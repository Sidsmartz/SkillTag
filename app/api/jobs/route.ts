import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch all active jobs from the database
    const jobs = await db.collection('jobs').find({ status: 'active' }).toArray();
    
    // Transform the data to match the UI requirements
    const transformedJobs = jobs.map(job => ({
      id: job._id.toString(),
      gigTitle: job.gigTitle,
      category: job.category,
      description: job.description,
      duration: job.duration,
      stipend: job.stipend,
      location: job.location,
      requiredSkills: job.requiredSkills,
      requiredExperience: job.requiredExperience,
      numberOfPositions: job.numberOfPositions,
      applicationDeadline: job.applicationDeadline,
      datePosted: job.datePosted,
      status: job.status
    }));
    
    return NextResponse.json(transformedJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
