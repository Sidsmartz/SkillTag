"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bookmark,
  Clock,
  Users,
  Home,
  MessageCircle,
  Bell,
  Building2,
  User,
  FileText,
  Clock3,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ClickSpark from "@/utils/ClickSpark/ClickSpark";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

export default function Component() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleApply = async (jobId: string) => {
    if (applyingJobId) return; // Prevent multiple clicks
    
    setApplyingJobId(jobId);
    try {
      const res = await fetch(`/api/gigs/${jobId}/apply`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        // Update UI to show applied state
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, hasApplied: true } : job
        ));
      } else {
        alert(data.error || 'Failed to apply. Please try again.');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to check if deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return currentDate > deadlineDate;
  };

  // Helper function to format deadline display
  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return "Deadline passed";
    } else if (daysDiff === 0) {
      return "Deadline today";
    } else if (daysDiff === 1) {
      return "1 day left";
    } else {
      return `${daysDiff} days left`;
    }
  };

  const JobCard = ({ job }: { job: any }) => {
    const deadlinePassed = isDeadlinePassed(job.applicationDeadline);
    const deadlineText = formatDeadline(job.applicationDeadline);
    
    // Calculate days difference for styling
    const deadlineDate = new Date(job.applicationDeadline);
    const currentDate = new Date();
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Parse company from gigTitle if missing
    let companyName = job.company;
    if (!companyName && job.gigTitle) {
      // Extract first word or words before first space or dash
      const match = job.gigTitle.match(/^([\w\-&]+)/);
      companyName = match ? match[1] : 'Unknown Company';
    }

    return (
    <Card className="bg-white rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">{companyName?.substring(0, 2) || 'CO'}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{companyName || 'Unknown Company'}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-500" />
                <span>{job.numberOfPositions || 'N/A'} Openings</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.duration || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {job.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-purple-600 text-lg">₹</span>
            <span className="text-purple-600 font-semibold text-lg">{job.stipend || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3">
            <ClickSpark
              sparkColor="#000"
              sparkSize={5}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="w-4 h-4 text-gray-400" />
              </Button>
            </ClickSpark>
            {deadlinePassed ? (
              <Button 
                disabled 
                className="bg-gray-400 text-gray-600 px-6 py-2 rounded-full cursor-not-allowed"
              >
                Deadline Passed
              </Button>
            ) : (
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
                disabled={applyingJobId === job.id || job.hasApplied}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(job.id);
                }}
              >
                {applyingJobId === job.id ? 'Applying...' : job.hasApplied ? 'Applied' : 'Apply'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Deadline indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Application Deadline:</span>
            <span className={`font-medium ${
              deadlinePassed 
                ? "text-red-500" 
                : daysDiff <= 3 
                  ? "text-orange-500" 
                  : "text-green-500"
            }`}>
              {deadlineText}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <>
      {/* Mobile Layout - Below 700px */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 lg:hidden">
        <div className="w-full max-w-sm bg-gradient-to-b from-purple-100 to-purple-200 rounded-3xl shadow-2xl overflow-hidden relative min-h-screen flex flex-col">
          <Navbar />
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-8">
            <div>
              <p className="text-gray-600 text-sm mb-1">Good morning, {session?.user?.name?.split(' ')[0] || 'User'}!</p>
              <p className="text-purple-600 text-xl font-semibold">Find Your Next Gig</p>
            </div>
            <Avatar className="w-12 h-12 bg-gray-300">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="bg-gray-300">{session?.user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
          </div>

          {/* Job Cards */}
          <div className="px-4 space-y-4 pb-4 flex-1 flex flex-col overflow-y-auto">
            {loading ? (
              // Show loading state
              <div className="flex-1">
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="bg-white rounded-2xl shadow-sm animate-pulse mb-4"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="flex items-center gap-4">
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex items-center justify-between">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : jobs.length > 0 ? (
              // Show jobs
              <div className="flex-1">
                {jobs.map((job) => (
                  <div key={job.id} className="mb-4">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              // Show empty state
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs available at the moment</p>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Above 700px */}
      <div className="hidden lg:flex min-h-screen bg-black">
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 p-8 flex flex-col lg:ml-64">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Available Gigs</h1>
            <p className="text-gray-400">Find your next opportunity</p>
          </div>

          {/* Job Cards Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {loading ? (
              // Show loading state
              Array(6)
                .fill(null)
                .map((_, index) => (
                  <Card
                    key={index}
                    className="bg-white rounded-2xl shadow-sm animate-pulse"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : jobs.length > 0 ? (
              // Show jobs
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              // Show empty state
              <div className="col-span-3 flex items-center justify-center min-h-[400px]">
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs available at the moment</p>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
