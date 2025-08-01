'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import SidebarNav from '@/components/SidebarNav';

type Application = {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  gig: {
    id: string;
    title: string;
    company: string;
    duration: string;
    stipend: string;
    location: string;
    deadline: string;
  };
};

export default function MyZigs() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications/mine');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock3 className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black">
        <SidebarNav student={true} />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>
            <p className="text-gray-400">Loading your applications...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-black">
        <SidebarNav student={true} />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SidebarNav student={true} />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
            <p className="text-gray-400">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">No applications yet</h2>
              <p className="text-gray-400 mb-6">You haven't applied to any gigs yet.</p>
              <Button href="/home" className="bg-purple-600 hover:bg-purple-700">
                Browse Gigs
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {app.gig.title}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">{app.gig.company}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                        {getStatusIcon(app.status)}
                        <span className="text-sm">{getStatusText(app.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{app.gig.duration}</span>
                      </div>
                      <div>₹{app.gig.stipend}</div>
                      <div>{app.gig.location}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
