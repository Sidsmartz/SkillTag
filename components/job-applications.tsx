"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Clock, Zap, Check, X, Eye, Send, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type ApplicationStatus = "applied" | "shortlisted" | "accepted" | "rejected" | "submitted"

interface Applicant {
  _id: string; // student id
  name?: string;
  email: string;
  status: ApplicationStatus;
  appliedAt: string;
  avatar?: string;
  institution?: string;
}

interface JobApplicationsProps {
  jobId: string
}

/*
  {
    id: 2,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 3,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 4,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 5,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 6,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 7,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 8,
    name: "Akhil Samudrala",
    institution: "NIT Raipur",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "applied",
  },
  {
    id: 9,
    name: "Priya Sharma",
    institution: "IIT Delhi",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "shortlisted",
  },
  {
    id: 10,
    name: "Rahul Kumar",
    institution: "BITS Pilani",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "shortlisted",
  },
  {
    id: 11,
    name: "Sneha Patel",
    institution: "NIT Trichy",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "accepted",
  },
  {
    id: 12,
    name: "Arjun Singh",
    institution: "IIT Bombay",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "rejected",
  },
  {
    id: 13,
    name: "Kavya Reddy",
    institution: "IIIT Hyderabad",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "submitted",
  },
*/

export default function JobApplications({ jobId }: JobApplicationsProps) {
  const [activeTab, setActiveTab] = useState<ApplicationStatus>("applied")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set())

  // fetch applicants
  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch(`/api/gigs/${jobId}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.applicants) {
          setApplicants(data.applicants)
        }
      } catch (e) {
        console.error("Failed to fetch applicants", e)
      }
    }
    fetchApplicants()
  }, [jobId])

  const filteredApplicants = applicants.filter((applicant) => applicant.status === activeTab)

  const getTabCount = (status: ApplicationStatus) => {
    return applicants.filter((applicant) => applicant.status === status).length
  }

  const toggleApplicantSelection = (applicantId: string) => {
    const newSelected = new Set(selectedApplicants)
    if (newSelected.has(applicantId)) {
      newSelected.delete(applicantId)
    } else {
      newSelected.add(applicantId)
    }
    setSelectedApplicants(newSelected)
  }

  // Applied → Shortlist or Reject
  const handleShortlist = () => {
    if (selectedApplicants.size === 0) return
    setApplicants((prev) =>
      prev.map((applicant) => {
        if (selectedApplicants.has(applicant._id)) {
          return { ...applicant, status: "shortlisted" as ApplicationStatus }
        }
        return applicant
      }),
    )
    setSelectedApplicants(new Set())
  }

  const handleReject = () => {
    if (selectedApplicants.size === 0) return
    setApplicants((prev) =>
      prev.map((applicant) => {
        if (selectedApplicants.has(applicant._id)) {
          return { ...applicant, status: "rejected" as ApplicationStatus }
        }
        return applicant
      }),
    )
    setSelectedApplicants(new Set())
  }

  // Shortlisted → Accept
  const handleAccept = () => {
    if (selectedApplicants.size === 0) return
    setApplicants((prev) =>
      prev.map((applicant) => {
        if (selectedApplicants.has(applicant._id)) {
          return { ...applicant, status: "accepted" as ApplicationStatus }
        }
        return applicant
      }),
    )
    setSelectedApplicants(new Set())
  }

  // Accepted → Send to Submit
  const handleSendToSubmit = () => {
    if (selectedApplicants.size === 0) return
    setApplicants((prev) =>
      prev.map((applicant) => {
        if (selectedApplicants.has(applicant._id)) {
          return { ...applicant, status: "submitted" as ApplicationStatus }
        }
        return applicant
      }),
    )
    setSelectedApplicants(new Set())
  }

  const handleViewTasks = () => {
    // Handle view tasks functionality
    console.log("View tasks for selected applicants:", Array.from(selectedApplicants))
  }

  const handleViewApplication = () => {
    // Handle view application functionality
    console.log("View application for selected applicants:", Array.from(selectedApplicants))
  }

  const tabs: { key: ApplicationStatus; label: string }[] = [
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
    { key: "submitted", label: "Submitted" },
  ]

  const getActionButtons = () => {
    if (selectedApplicants.size === 0) return null

    const selectedCount = selectedApplicants.size
    const countText = `${selectedCount} applicant${selectedCount > 1 ? "s" : ""} selected`

    switch (activeTab) {
      case "applied":
        return (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{countText}</span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent px-6 py-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleShortlist} className="bg-[#5E17EB] hover:bg-[#4A12C4] text-white px-6 py-2">
                  <Check className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
              </div>
            </div>
          </div>
        )

      case "shortlisted":
        return (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{countText}</span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent px-6 py-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )

      case "accepted":
        return (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{countText}</span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleViewTasks}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Tasks
                </Button>
                <Button onClick={handleSendToSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Submit
                </Button>
              </div>
            </div>
          </div>
        )

      case "submitted":
        return (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{countText}</span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleViewApplication}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Application
                </Button>
                <Button
                  onClick={handleViewTasks}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Tasks
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/my-zigs" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Job Applications Container - Reduced width */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white text-black rounded-xl shadow-lg">
          <CardContent className="p-6">
            {/* Job Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                Create <span className="font-semibold text-gray-900">UGC Videos</span> and get shares on Instagram about
                Myntra Showbizz now, get shares on Instagram about Myntra Showbizz now.
              </p>
            </div>

            {/* Job Stats */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1">
                <Zap className="w-5 h-5 text-[#5E17EB]" />
                <span className="font-bold text-lg">350</span>
              </div>
              <div className="flex items-center gap-1 text-[#5E17EB]">
                <Users className="w-4 h-4" />
                <span className="text-sm">{applicants.length} Applicants</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">1d ago</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    setSelectedApplicants(new Set()) // Clear selections when switching tabs
                  }}
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

            {/* Applicants List */}
            <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
              {filteredApplicants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No applicants in this category yet.</div>
              ) : (
                filteredApplicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                              <div className="flex items-center gap-3">
                                <Link href={`/companies/profile/${applicant._id}`}>
                                  <Image
                                    src={applicant.avatar || "/placeholder.svg"}
                                    alt={applicant.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                                  />
                                </Link>
                                <Link href={`/companies/profile/${applicant._id}`} className="text-sm font-medium text-gray-900 hover:underline">
                                  {applicant.name}
                                </Link>
                                <p className="text-sm text-gray-500">{applicant.institution}</p>
                              </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="text-sm px-4 py-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        View Application
                      </Button>
                      {/* Only show selection circle for actionable tabs */}
                      {(activeTab === "applied" ||
                        activeTab === "shortlisted" ||
                        activeTab === "accepted" ||
                        activeTab === "submitted") && (
                        <button
                          onClick={() => toggleApplicantSelection(applicant._id)}
                          className={`w-6 h-6 rounded-full border-2 transition-colors ${
                            selectedApplicants.has(applicant._id)
                              ? "bg-[#5E17EB] border-[#5E17EB]"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {selectedApplicants.has(applicant._id) && <Check className="w-3 h-3 text-white mx-auto" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Dynamic Action Buttons */}
            {getActionButtons()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
