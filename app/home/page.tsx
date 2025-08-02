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
  const [bookmarkedApplications, setBookmarkedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [bookmarkingJobId, setBookmarkingJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gigs' | 'bookmarks'>('gigs');
  const { data: session } = useSession();

  const handleApply = async (jobId: string) => {
    if (applyingJobId) return; // Prevent multiple clicks

    setApplyingJobId(jobId);
    try {
      const res = await fetch(`/api/gigs/${jobId}/apply`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        // Update UI to show applied state
        setJobs(
          jobs.map((job) =>
            job.id === jobId ? { ...job, hasApplied: true } : job
          )
        );
      } else {
        alert(data.error || "Failed to apply. Please try again.");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleBookmark = async (applicationId: string) => {
    if (bookmarkingJobId) return; // Prevent multiple clicks

    setBookmarkingJobId(applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}/bookmark`, { 
        method: "PATCH" 
      });
      const data = await res.json();

      if (res.ok) {
        // Update bookmarked applications list
        if (data.bookmarked) {
          // Refresh bookmarked applications
          fetchBookmarkedApplications();
        } else {
          // Remove from bookmarked applications
          setBookmarkedApplications(
            bookmarkedApplications.filter(app => app._id !== applicationId)
          );
        }
      } else {
        alert(data.error || "Failed to bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
      alert("Failed to bookmark. Please try again.");
    } finally {
      setBookmarkingJobId(null);
    }
  };

  const fetchBookmarkedApplications = async () => {
    if (!session?.user?.email) return;
    
    setBookmarksLoading(true);
    try {
      const res = await fetch('/api/students/me');
      if (res.ok) {
        const data = await res.json();
        const bookmarked = data.applications?.filter((app: any) => app.bookmarked) || [];
        setBookmarkedApplications(bookmarked);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarked applications:', error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    if (session?.user?.email) {
      fetchBookmarkedApplications();
    }
  }, [session?.user?.email]);

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
      companyName = match ? match[1] : "Unknown Company";
    }

    return (
      <Card className="bg-white rounded-2xl shadow-sm max-h-[200px]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                {companyName?.substring(0, 2) || "CO"}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {companyName || "Unknown Company"}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>{job.numberOfPositions || "N/A"} Openings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.duration || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {job.description || "No description provided"}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-purple-600 text-lg">₹</span>
              <span className="text-purple-600 font-semibold text-lg">
                {job.stipend || "N/A"}
              </span>
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
                  {applyingJobId === job.id
                    ? "Applying..."
                    : job.hasApplied
                    ? "Applied"
                    : "Apply"}
                </Button>
              )}
            </div>
          </div>

          {/* Deadline indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Application Deadline:</span>
              <span
                className={`font-medium ${
                  deadlinePassed
                    ? "text-red-500"
                    : daysDiff <= 3
                    ? "text-orange-500"
                    : "text-green-500"
                }`}
              >
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
              <p className="text-gray-600 text-sm mb-1">
                Good morning, {session?.user?.name?.split(" ")[0] || "User"}!
              </p>
              <p className="text-purple-600 text-xl font-semibold">
                {activeTab === 'gigs' ? 'Find Your Next Gig' : 'Your Bookmarks'}
              </p>
            </div>
            <Avatar className="w-12 h-12 bg-gray-300">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-gray-300">
                {session?.user?.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Tabs */}
          <div className="px-4 mb-4">
            <div className="flex bg-white rounded-xl p-1">
              <button
                onClick={() => setActiveTab('gigs')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'gigs'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Available Gigs
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Bookmarks
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 space-y-4 pb-4 flex-1 flex flex-col overflow-y-auto">
            {activeTab === 'gigs' ? (
              // Gigs Tab Content
              loading ? (
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
                    <p className="text-gray-500">
                      No jobs available at the moment
                    </p>
                    <Button
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              )
            ) : (
              // Bookmarks Tab Content
              bookmarksLoading ? (
                // Show loading state for bookmarks
                <div className="flex-1">
                  {Array(2)
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
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : bookmarkedApplications.length > 0 ? (
                // Show bookmarked applications
                <div className="flex-1">
                  {bookmarkedApplications.map((app) => (
                    <Card key={app._id} className="bg-white rounded-2xl shadow-sm mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">
                              {app.gig.company?.substring(0, 2) || app.gig.title?.substring(0, 2) || "CO"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {app.gig.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{app.gig.duration || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>₹{app.gig.stipend || 'Not specified'}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'selected' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBookmark(app._id)}
                                disabled={bookmarkingJobId === app._id}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Bookmark className="w-4 h-4 mr-1 fill-current" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Show empty bookmarks state
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center py-8">
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      No bookmarked applications yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Apply to gigs and bookmark them to see them here
                    </p>
                  </div>
                </div>
              )
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
            <h1 className="text-3xl font-bold text-white mb-2">
              {activeTab === 'gigs' ? 'Available Gigs' : 'Your Bookmarks'}
            </h1>
            <p className="text-gray-400">
              {activeTab === 'gigs' ? 'Find your next opportunity' : 'Manage your bookmarked applications'}
            </p>
            
            {/* Tabs */}
            <div className="mt-6">
              <div className="flex bg-gray-800 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setActiveTab('gigs')}
                  className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'gigs'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Available Gigs
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'bookmarks'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Bookmarks
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {activeTab === 'gigs' ? (
              // Gigs Tab Content
              loading ? (
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
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                // Show empty state
                <div className="col-span-3 flex items-center justify-center min-h-[400px]">
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No jobs available at the moment
                    </p>
                    <Button
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              )
            ) : (
              // Bookmarks Tab Content
              bookmarksLoading ? (
                // Show loading state for bookmarks
                Array(4)
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
                      </CardContent>
                    </Card>
                  ))
              ) : bookmarkedApplications.length > 0 ? (
                // Show bookmarked applications
                bookmarkedApplications.map((app) => (
                  <Card key={app._id} className="bg-white rounded-2xl shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-lg">
                            {app.gig.company?.substring(0, 2) || app.gig.title?.substring(0, 2) || "CO"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {app.gig.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{app.gig.duration || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>₹{app.gig.stipend || 'Not specified'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                              app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'selected' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBookmark(app._id)}
                              disabled={bookmarkingJobId === app._id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Bookmark className="w-4 h-4 mr-1 fill-current" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Show empty bookmarks state
                <div className="col-span-3 flex items-center justify-center min-h-[400px]">
                  <div className="text-center py-8">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      No bookmarked applications yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Apply to gigs and bookmark them to see them here
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
