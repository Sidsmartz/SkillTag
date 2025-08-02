"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  MessageCircle,
  Bell,
  Building2,
  User,
  FileText,
  Clock3,
  CheckCircle,
  ArrowLeft,
  X,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "available",
    skills: [],
    phone: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || "",
          description: data.description || "",
          status: data.status || "available",
          skills: data.skills || [],
          phone: data.phone || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (skillInput && !form.skills.includes(skillInput)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput] }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Navbar />
      <div className="flex-1 flex justify-center items-start p-8 lg:ml-64">
        <Card className="w-full max-w-xl mt-8">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 mt-1"
                >
                  <option value="available">Available for Zigs</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <Label>Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill"
                  />
                  <Button type="button" onClick={handleSkillAdd}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, idx) => (
                    <Badge key={idx} className="flex items-center gap-1 bg-gray-200 text-black">
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-xs text-red-500"
                        onClick={() => handleSkillRemove(skill)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
