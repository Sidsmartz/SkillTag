import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Mail, Phone, Briefcase, GraduationCap, Edit, User } from 'lucide-react';
import { ProfileForm } from '@/components/profile-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  headline?: string;
  about?: string;
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.email === userId || session?.user?.id === userId;
  
  // Validate userId format
  if (!userId || typeof userId !== 'string') {
    return notFound();
  }
  
  let userProfile = null;
  
  try {
    // Fetch user data directly in the server component
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/details?${isCurrentUser ? 'email' : 'userId'}=${userId}`, 
      { 
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      return notFound();
    }
    
    userProfile = await response.json();
    
    if (!userProfile || !userProfile._id) {
      return notFound();
    }

    return (
      <div className="h-screen bg-black text-white overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with edit button for current user */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-[34px]"></div>
            {isCurrentUser && (
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
          
          {isCurrentUser ? (
            <ProfileForm initialData={userProfile} />
          ) : (
            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32">
                      <AvatarImage src={userProfile.image || ''} alt={userProfile.name} />
                      <AvatarFallback>
                        {userProfile.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                      {userProfile.headline && (
                        <p className="text-gray-400 mt-1">{userProfile.headline}</p>
                      )}
                      {userProfile.location && (
                        <div className="flex items-center justify-center md:justify-start mt-2 text-gray-400 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {userProfile.location}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              {userProfile.about && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">About</h2>
                    <p className="text-gray-300 whitespace-pre-line">{userProfile.about}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Skills</h2>
                  {userProfile.skills && userProfile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No skills listed.</p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userProfile.email}</span>
                    </div>
                    {userProfile.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{userProfile.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Social Links</h3>
                    <div className="flex gap-3">
                      {userProfile.linkedin && (
                        <a 
                          href={userProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {userProfile.github && (
                        <a 
                          href={userProfile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {userProfile.portfolio && (
                        <a 
                          href={userProfile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                            <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in UserProfilePage:', error);
    return notFound();
  }
}
