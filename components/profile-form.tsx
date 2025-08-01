'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface ProfileFormProps {
  initialData: {
    name?: string;
    headline?: string;
    about?: string;
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
    }>;
    education?: Array<{
      school: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }>;
    portfolio?: string;
    linkedin?: string;
    github?: string;
    phone?: string;
    location?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Ensure we're not sending empty strings for optional fields
          ...(formData.portfolio === '' && { portfolio: undefined }),
          ...(formData.linkedin === '' && { linkedin: undefined }),
          ...(formData.github === '' && { github: undefined }),
          ...(formData.phone === '' && { phone: undefined }),
          ...(formData.location === '' && { location: undefined }),
          ...(formData.dateOfBirth === '' && { dateOfBirth: undefined }),
          ...(formData.gender === '' && { gender: undefined }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="headline" className="block text-sm font-medium mb-1">
              Headline
            </label>
            <Input
              id="headline"
              name="headline"
              value={formData.headline || ''}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">About</h3>
        <div>
          <label htmlFor="about" className="block text-sm font-medium mb-1">
            Tell us about yourself
          </label>
          <Textarea
            id="about"
            name="about"
            value={formData.about || ''}
            onChange={handleChange}
            placeholder="A brief introduction about yourself..."
            rows={4}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium mb-1">
            Add your skills (comma separated)
          </label>
          <Input
            id="skills"
            name="skills"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) => {
              const skills = e.target.value.split(',').map(skill => skill.trim());
              setFormData(prev => ({
                ...prev,
                skills
              }));
            }}
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
              LinkedIn
            </label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label htmlFor="github" className="block text-sm font-medium mb-1">
              GitHub
            </label>
            <Input
              id="github"
              name="github"
              type="url"
              value={formData.github || ''}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium mb-1">
              Portfolio Website
            </label>
            <Input
              id="portfolio"
              name="portfolio"
              type="url"
              value={formData.portfolio || ''}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
