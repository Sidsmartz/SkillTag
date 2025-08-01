"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Eye, FileText, Send, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ApplicationStatus = "applied" | "pending" | "shortlisted" | "accepted" | "rejected" | "submitted"

interface Student {
  _id: string
  name: string
  email: string
  status: ApplicationStatus
  appliedAt: string
}

interface Applicant {
  _id: string
  student: Student
  status: ApplicationStatus
  appliedAt: string
}

interface Job {
  _id: string
  gigTitle: string
  description: string
  datePosted: string
  applicants: Applicant[]
}

interface UserData {
  _id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

type UserDataWithDefault = UserData | { email: string; name?: undefined; profileImage?: undefined; }

export default function CompaniesJobApplicationsPage({ params }: { params: { jobId: string } }) {
  const [activeTab, setActiveTab] = useState<ApplicationStatus>("pending")
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [userDataMap, setUserDataMap] = useState<Record<string, UserData | null>>({})
  const [jobId, setJobId] = useState<string | null>(null)

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params
      setJobId(resolvedParams.jobId)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
    if (!jobId) return
    
    async function fetchJob() {
      try {
        const res = await fetch(`/api/gigs/${jobId}`)
        if (!res.ok) throw new Error("Failed to fetch job")
        const data = await res.json()
        setJob(data)

        // Fetch user data for all applicants
        if (data.applicants?.length > 0) {
          const emails = data.applicants
            .filter((a: Applicant) => a.student?.email)
            .map((a: Applicant) => a.student.email) as string[]
          const userDataPromises = emails.map(async (email: string) => {
            try {
              const userRes = await fetch(`/api/user/details?email=${encodeURIComponent(email)}`)
              if (userRes.ok) {
                const userData = await userRes.json()
                return { email, data: userData }
              }
              return { email, data: null }
            } catch (error) {
              console.error(`Error fetching user data for ${email}:`, error)
              return { email, data: null }
            }
          })

          const userDataResults = await Promise.all(userDataPromises)
          const newUserDataMap: Record<string, UserData | null> = {}
          userDataResults.forEach(({ email, data }) => {
            newUserDataMap[email] = data
          })
          setUserDataMap(newUserDataMap)
        }
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  // Debug: Log job data and filtered applicants
  useEffect(() => {
    if (job?.applicants) {
      console.log('Job data:', job);
      console.log('All applicants with statuses:', job.applicants.map(app => ({
        id: app._id,
        email: app.student?.email,
        status: app.status,
        studentStatus: app.student?.status,
        appliedAt: app.appliedAt
      })));
      console.log('Active tab:', activeTab);
      
      const filtered = job.applicants.filter(
        (applicant) => applicant.status === activeTab
      );
      console.log('Filtered applicants:', filtered);
      
      // Log why applicants might be filtered out
      job.applicants.forEach(applicant => {
        console.log(`Applicant ${applicant._id} status: ${applicant.status}, matches active tab: ${applicant.status === activeTab}`);
      });
    }
  }, [job, activeTab]);

  // Debug: Log all status values
  useEffect(() => {
    if (job?.applicants) {
      console.log('All applicants with statuses:', job.applicants.map(app => ({
        id: app._id,
        email: app.student?.email,
        status: app.status,
        studentStatus: app.student?.status,
        appliedAt: app.appliedAt
      })));
      console.log('Active tab:', activeTab);
    }
  }, [job, activeTab]);

  // Map UI status to database status
  const getStatusForTab = (tab: ApplicationStatus): string => {
    // Map 'applied' tab to 'pending' status in the database
    if (tab === 'applied') return 'pending';
    return tab;
  };

  const filteredApplicants = job?.applicants?.filter(applicant => {
    const statusToMatch = getStatusForTab(activeTab);
    // Check status at the root level of the applicant object
    const matches = applicant.status === statusToMatch;
    console.log(`Applicant ${applicant._id} status: '${applicant.student?.status}', looking for: '${statusToMatch}', matches: ${matches}`);
    return matches;
  }) || [];

  const getTabCount = (status: ApplicationStatus) => {
    return job?.applicants?.filter(
      (applicant) => applicant.status === getStatusForTab(status)
    ).length || 0;
  }

  const handleViewApplication = async (email: string) => {
    try {
      const res = await fetch(`/api/user/details?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error("Failed to fetch user profile")
      const userData = await res.json()
      if (userData?._id) {
        window.location.href = `/profile/${userData._id}`
      }
    } catch (error) {
      console.error("Error viewing application:", error)
    }
  }

  const handleStatusUpdate = async (email: string, newStatus: ApplicationStatus) => {
    try {
      const res = await fetch(`/api/applications/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          email,
          status: newStatus
        })
      })
      if (!res.ok) throw new Error("Failed to update status")
      
      // Refresh job data
      const jobRes = await fetch(`/api/gigs/${jobId}`)
      if (!jobRes.ok) throw new Error("Failed to refresh job")
      const updatedJob = await jobRes.json()
      setJob(updatedJob)
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const tabs = [
    { key: "applied" as const, label: "Pending" },
    { key: "shortlisted" as const, label: "Shortlisted" },
    { key: "accepted" as const, label: "Accepted" },
    { key: "rejected" as const, label: "Rejected" },
    { key: "submitted" as const, label: "Submitted" }
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!job) {
    return <div className="flex items-center justify-center h-screen">Job not found</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-6">
        <Link href="/companies/my-zigs" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-white text-black rounded-xl shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{job.gigTitle}</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1 text-[#5E17EB]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{job.applicants?.length || 0} Applicants</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{new Date(job.datePosted).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? "text-[#5E17EB] border-b-2 border-[#5E17EB]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {getTabCount(tab.key) > 0 && <span className="ml-1 text-xs">({getTabCount(tab.key)})</span>}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
              {filteredApplicants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No applicants in this category yet.</div>
              ) : (
                filteredApplicants.map((applicant, index) => {
                  // Ensure we have a valid student object with safe defaults
                  const student: Student = applicant.student || {
                    _id: '',
                    name: 'Unknown User',
                    email: '',
                    status: 'applied',
                    appliedAt: new Date().toISOString()
                  }
                  
                  const email = student.email || ''
                  const userData = userDataMap[email] || { _id: '', email: '', name: '' } as UserData
                  const displayName = userData.name || student.name || 'Unknown User'
                  const profileImage = userData.profileImage || (userData as any).image
                  const appliedDate = student.appliedAt ? new Date(student.appliedAt).toLocaleDateString() : 'N/A'
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt={displayName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {displayName?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{displayName}</h4>
                          <p className="text-sm text-gray-500">
                            Applied {new Date(applicant.student.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="text-sm px-4 py-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => handleViewApplication(email)}
                        >
                          View Profile
                        </Button>
                        {activeTab === "applied" && (
                          <>
                            <Button
                              onClick={() => handleStatusUpdate(email, "rejected")}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(email, "shortlisted")}
                              className="bg-[#5E17EB] hover:bg-[#4A12C4] text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {activeTab === "shortlisted" && (
                          <Button
                            onClick={() => handleStatusUpdate(email, "accepted")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4"
                          >
                            Accept
                          </Button>
                        )}
                        {activeTab === "accepted" && (
                          <Button
                            onClick={() => handleStatusUpdate(email, "submitted")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                          >
                            Send to Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}