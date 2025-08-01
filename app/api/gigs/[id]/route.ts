import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface Application {
  applicantEmail: string
  status: string
  appliedAt: string
  resumeUrl?: string
  coverLetter?: string
  portfolio?: string
  skills?: string[]
}

interface Applicant {
  email: string
  status: string
  appliedAt: string
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Wait for params to be available and convert string ID to MongoDB ObjectId
    const { id } = await Promise.resolve(context.params)
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 })
    }
    const objectId = new ObjectId(id)

    // Find the job and populate with applicant details
    const job = await db.collection("jobs").findOne({ _id: objectId })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Ensure applicants array exists based on stored applicants or legacy applications
    if (!job.applicants && job.applications) {
      job.applicants = job.applications.map((app: Application) => ({
        email: app.applicantEmail,
        status: app.status,
        appliedAt: app.appliedAt
      }))
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { error: "Failed to fetch job details" },
      { status: 500 }
    )
  }
}
