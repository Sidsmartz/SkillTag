"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  MessageCircle,
  Bell,
  Building2,
  User,
  FileText,
  Clock3,
  CheckCircle,
  Star,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProfileComponent() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    description: "",
    status: "available",
    skills: [],
    gender: "",
    dateOfBirth: "",
    phone: "+91 8008000988",
    referredPeople: [],
    referredBy: null,
  });
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return;

      if (status === "authenticated" && session?.user) {
        try {
          // Set basic data from session
          setUserData((prev) => ({
            ...prev,
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || "",
          }));

          // Fetch complete profile data from API
          const response = await fetch("/api/user/profile");

          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }

          const profileData = await response.json();

          // Update user data with profile information
          setUserData((prev) => ({
            ...prev,
            name: profileData.name || prev.name,
            description: profileData.description || "",
            status: profileData.status || "available",
            skills: profileData.skills || [],
            gender: profileData.gender || "",
            dateOfBirth: profileData.dateOfBirth || "",
            phone: profileData.phone || "+91 8008000988",
          }));

          // Generate referral link based on user email
          if (profileData.email) {
            const encodedEmail = encodeURIComponent(profileData.email);
            setReferralLink(`www.skilltag.in/signup?ref=${encodedEmail}`);
          }

          // Fetch referrals data
          const referralsResponse = await fetch("/api/user/referrals");

          if (referralsResponse.ok) {
            const referralsData = await referralsResponse.json();
            setReferrals(referralsData.referredPeople || []);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, toast]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userData.name) return "GT";
    return userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard",
      variant: "default",
    });
  };

  return (
    <>
      {/* Mobile Layout - Below 700px */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 lg:hidden">
        <div className="w-full max-w-sm bg-gradient-to-b from-purple-100 to-purple-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-8 sticky top-0 z-10 bg-gradient-to-b from-purple-100 to-purple-200">
            <div>
              <p className="text-gray-600 text-sm mb-1">
                Hello, {userData.name?.split(" ")[0] || "Guest"}!
              </p>
              <p className="text-purple-600 text-xl font-semibold">Profile</p>
            </div>
            <Avatar className="w-12 h-12 bg-gray-300">
              {userData.image ? (
                <AvatarImage
                  src={userData.image}
                  alt={userData.name || "User"}
                />
              ) : (
                <AvatarFallback className="bg-gray-300">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Profile Content - Mobile - Scrollable */}
          <div className="px-4 space-y-4 pb-4 flex-1 overflow-y-auto">
            {/* Profile Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 bg-gray-300">
                  {userData.image ? (
                    <AvatarImage
                      src={userData.image}
                      alt={userData.name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-300 text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-xl font-semibold mb-2">
                  {userData.name || "User Name"}
                </h2>
                <Badge className="bg-green-500 text-white mb-3">
                  {userData.status === "available"
                    ? "Available for Zigs"
                    : userData.status === "busy"
                    ? "Busy"
                    : "Offline"}
                </Badge>
                <div className="flex justify-center items-center gap-1 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  <span className="ml-1 text-sm text-gray-600">5.0</span>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Skills and Expertise</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {userData.skills && userData.skills.length > 0 ? (
                    userData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description Card - Added to mobile */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {userData.description ? (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {userData.description}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No description added yet. Add a description to tell others
                    about yourself.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Education Card - Added to mobile */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* Note: This is still using mock data as education info is not yet in the API */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-yellow-400">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">College Name</h3>
                    <p className="text-xs text-gray-500">CSE | 2009-2013</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details Card - Added to mobile */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2 text-sm">
                <div>
                  <span className="font-medium">Mobile Number:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.phone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.email || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Gender:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.gender || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.dateOfBirth
                      ? new Date(userData.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  Refer Friends and Earn 10% of their earning for life.
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
                  />
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={copyReferralLink}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Referrals Card - Added to mobile */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  My Referrals ({referrals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {referrals.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {referrals.map((referral, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          {referral.image ? (
                            <AvatarImage
                              src={referral.image}
                              alt={referral.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-yellow-400 text-xs">
                              {referral.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{referral.name}</p>
                          <p className="text-xs text-gray-500">
                            {referral.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    You haven't referred anyone yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Navigation - Fixed at bottom */}
          <div className="bg-purple-600 px-4 py-4 rounded-t-3xl sticky bottom-0 z-10">
            <div className="flex items-center justify-around">
              <Link href="/home">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-purple-500 h-12 w-12"
                >
                  <Home className="w-6 h-6" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-500 h-12 w-12"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-500 h-12 w-12"
              >
                <Bell className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-500 h-12 w-12"
              >
                <Building2 className="w-6 h-6" />
              </Button>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-purple-500 h-12 w-12 bg-purple-500"
                >
                  <User className="w-6 h-6 fill-current" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Above 700px */}
      <div className="hidden lg:flex min-h-screen bg-black">
        {/* Sidebar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 p-8 lg:ml-64">
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {/* Profile Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 bg-gray-300">
                  {userData.image ? (
                    <AvatarImage
                      src={userData.image}
                      alt={userData.name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-300 text-3xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-semibold mb-3">
                  {userData.name || "User Name"}
                </h2>
                <Badge
                  className={`${
                    userData.status === "available"
                      ? "bg-green-500"
                      : userData.status === "busy"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  } text-white mb-4`}
                >
                  {userData.status === "available"
                    ? "Available for Zigs"
                    : userData.status === "busy"
                    ? "Busy"
                    : "Offline"}
                </Badge>
                <div className="flex justify-center items-center gap-1 mb-6">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  <span className="ml-2 text-lg font-medium">5.0</span>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Skills and Expertise</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {userData.skills && userData.skills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {userData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 py-2 justify-center"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No skills added yet. Add skills to showcase your expertise.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Refer Friends and Earn 10% of their earning for life.
                </h3>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                  />
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={copyReferralLink}
                  >
                    Copy
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">
                    My Referrals ({referrals.length})
                  </h4>
                  {referrals.length > 0 ? (
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {referrals.map((referral, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            {referral.image ? (
                              <AvatarImage
                                src={referral.image}
                                alt={referral.name}
                              />
                            ) : (
                              <AvatarFallback className="bg-yellow-400 text-xs">
                                {referral.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {referral.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {referral.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      You haven't referred anyone yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="bg-white rounded-2xl shadow-sm col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {userData.description ? (
                  <p className="text-gray-700 leading-relaxed">
                    {userData.description}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No description added yet. Add a description to tell others
                    about yourself.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Education Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Education</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {/* Note: This is still using mock data as education info is not yet in the API */}
                {/* This can be updated when education data is available in the user profile */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-yellow-400">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">College Name</h3>
                    <p className="text-sm text-gray-500">CSE | 2009-2013</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details Card */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                <div>
                  <span className="font-medium">Mobile Number:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.phone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.email || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Gender:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.gender || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span>
                  <span className="ml-2 text-gray-600">
                    {userData.dateOfBirth
                      ? new Date(userData.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* My Referrals Card - Desktop Extended */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  My Referrals ({referrals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {referrals.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {referrals.map((referral, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {referral.image ? (
                            <AvatarImage
                              src={referral.image}
                              alt={referral.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-yellow-400">
                              {referral.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-sm text-gray-500">
                            {referral.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    You haven't referred anyone yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
