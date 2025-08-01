"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BarChart3, User, Home, Clock, Zap, Filter, Bookmark } from "lucide-react"
import Image from "next/image"

export default function MyZigs() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState({})
  const [isPopulating, setIsPopulating] = useState(false)

  async function populateSampleData() {
    try {
      setIsPopulating(true)
      // First populate jobs if needed
      const resJobs = await fetch("/api/gigs/seed", {
        method: "POST"
      })
      if (!resJobs.ok) throw new Error("Failed to populate jobs")
      
      // Then populate applications
      const resApps = await fetch("/api/gigs/populate-applications", {
        method: "POST"
      })
      if (!resApps.ok) throw new Error("Failed to populate applications")
      
      await fetchJobs()
    } catch (error) {
      console.error("Error populating data:", error)
    } finally {
      setIsPopulating(false)
    }
  }

  async function fetchJobs() {
    const res = await fetch("/api/gigs")
    const data = await res.json()
    setJobs(data)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    async function fetchApplications() {
      const appMap = {}
      for (const job of jobs) {
        const res = await fetch(`/api/applications?jobId=${job._id}`)
        const data = await res.json()
        appMap[job._id] = data
      }
      setApplications(appMap)
    }
    if (jobs.length > 0) fetchApplications()
  }, [jobs])

  const filteredJobs =
    activeFilter === "all"
      ? jobs
      : jobs.filter((job) => job.status === activeFilter)

  const getJobCounts = () => {
    return {
      all: jobs.length,
      active: jobs.filter((job) => job.status === "active").length,
      completed: jobs.filter((job) => job.status === "completed").length,
    }
  }
  const counts = getJobCounts()

  const markCompleted = async (jobId) => {
    await fetch(`/api/gigs/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, status: "completed" } : job
      )
    )
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="h-[34px]"></div>
      </div>
      <div className="flex h-[calc(100vh-120px)] gap-6">
        {/* Left Sidebar (Navbar) */}
        <div className="w-64 pl-8 pr-6 py-0 flex flex-col">
          <div className="flex flex-col items-center mb-12 mt-4">
            <img src="/zigwork-logo.svg" alt="Zigwork Logo" width={64} height={64} className="w-16 h-16 mb-2" />
            <span className="text-xl font-bold">zigwork</span>
          </div>
          <nav className="space-y-2 mb-auto">
            <a href="/companies" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">Home</span>
            </a>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#5E17EB]/20 text-[#5E17EB] border border-[#5E17EB]/30">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium text-sm">My Zigs</span>
            </div>
            <a href="/shortlist" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
              <Bookmark className="w-4 h-4" />
              <span className="font-medium text-sm">Shortlist</span>
            </a>
            <a href="/companies/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
              <User className="w-4 h-4" />
              <span className="font-medium text-sm">Profile</span>
            </a>
          </nav>
          <div className="space-y-2 text-xs text-gray-400 px-3 mb-4">
            <div className="hover:text-white cursor-pointer transition-colors">Support</div>
            <div className="hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
            <div className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</div>
            <div className="text-xs mt-4 text-gray-500">©All Rights Reserved Zigwork</div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden py-0">
          <div className="flex items-center justify-between mb-6 mt-0">
            <div className="flex items-center gap-3">
              <Button onClick={() => setActiveFilter("all")} variant="outline" className={`px-8 py-2 rounded-lg text-sm font-extralight transition-colors ${activeFilter === "all" ? "bg-[#5E17EB] text-white border-[#5E17EB]" : "bg-transparent border-white text-gray-300 hover:bg-gray-800"}`}>All Jobs {counts.all}</Button>
              <Button onClick={() => setActiveFilter("active")} variant="outline" className={`px-8 py-2 rounded-lg text-sm font-extralight transition-colors ${activeFilter === "active" ? "bg-[#5E17EB] text-white border-[#5E17EB]" : "bg-transparent border-white text-gray-300 hover:bg-gray-800"}`}>Active {counts.active}</Button>
              <Button onClick={() => setActiveFilter("completed")} variant="outline" className={`px-8 py-2 rounded-lg text-sm font-extralight transition-colors ${activeFilter === "completed" ? "bg-[#5E17EB] text-white border-[#5E17EB]" : "bg-transparent border-white text-gray-300 hover:bg-gray-800"}`}>Completed {counts.completed}</Button>
            </div>
            <Button variant="outline" className="bg-transparent border-white text-gray-300 hover:bg-gray-800 px-8 py-2 rounded-lg text-sm font-extralight flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hide h-[calc(100vh-10vh-140px)]">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white text-black rounded-xl shadow-sm h-[220px] flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/companies/job-applications/${job._id}`}>
                <div className="p-3 flex flex-col h-full">
                  <div className="mb-3 flex-1">
                    <h3 className="font-normal text-gray-700 leading-relaxed text-sm line-clamp-3">{job.gigTitle}</h3>
                    <p className="text-xs text-gray-500">{job.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#5E17EB]" />
                      <span>{applications[job._id]?.length || 0} Applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(job.datePosted).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {applications[job._id]?.map((app) => (
                      <div key={app._id} className="flex items-center justify-between text-xs bg-gray-100 rounded px-2 py-1">
                        <span>{app.applicantEmail}</span>
                        <span className={`px-2 py-1 rounded ${app.status === "accepted" ? "bg-green-200 text-green-800" : app.status === "rejected" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Button className="bg-[#5E17EB] hover:bg-[#4A12C4] text-white px-3 py-1 rounded-lg font-normal text-xs" onClick={() => markCompleted(job._id)} disabled={job.status === "completed"}>
                      {job.status === "completed" ? "Completed" : "Mark Completed"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
