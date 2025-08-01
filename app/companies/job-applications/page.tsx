import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CompaniesJobApplications() {
  // In a real app, you would fetch this from your API
  const jobs = [
    { _id: "1", gigTitle: "UI/UX Designer", applicantsCount: 3 },
    { _id: "2", gigTitle: "Frontend Developer", applicantsCount: 5 },
    // Add more jobs as needed
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Job Applications</h1>
      
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job._id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{job.gigTitle}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {job.applicantsCount} {job.applicantsCount === 1 ? 'applicant' : 'applicants'}
                </span>
                <Button asChild variant="outline">
                  <Link href={`/companies/job-applications/${job._id}`}>
                    View Applications
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}