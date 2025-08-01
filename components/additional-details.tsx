"use client";
import Link from "next/link";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { upload } from "@imagekit/next";
// Add import for PhoneInput
import { PhoneInput } from "./phone-input";

export default function AdditionalDetails() {
  const [institution, setInstitution] = useState("cbit");
  const [state, setState] = useState("telangana");
  const [graduationYear, setGraduationYear] = useState("2025");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [idImageUrl, setIdImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Get ImageKit upload auth params from your API
  const getAuthParams = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Failed to get upload auth params");
    return res.json();
  };

  // Helper to validate phone number (basic check)
  function isValidPhone(phone: string) {
    return phone && phone.length >= 10 && phone.startsWith("+");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number");
      return;
    }
    setIsUploading(true);

    let imageUrl = idImageUrl;
    if (
      fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files[0] &&
      !idImageUrl
    ) {
      try {
        const { signature, expire, token, publicKey } = await getAuthParams();
        const file = fileInputRef.current.files[0];
        const uploadRes = await upload({
          expire,
          token,
          signature,
          publicKey,
          file,
          fileName: file.name,
        });
        imageUrl = uploadRes.url || "";
        setIdImageUrl(imageUrl);
      } catch (err) {
        setError("Failed to upload image");
        setIsUploading(false);
        return;
      }
    }

    // Now submit the details with the image URL
    const res = await fetch("/api/user/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution,
        state,
        graduationYear,
        phone,
        idImageUrl: imageUrl,
      }),
    });
    setIsUploading(false);
    if (res.ok) {
      router.push("/home");
    } else {
      setError("Failed to save details");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% -20%, #c4f542 0%, #c4f542 15%, rgba(196, 245, 66, 0.6) 35%, rgba(196, 245, 66, 0.2) 50%, transparent 70%),
          radial-gradient(circle at 80% -10%, #c4f542 0%, #c4f542 8%, rgba(196, 245, 66, 0.4) 20%, rgba(196, 245, 66, 0.1) 35%, transparent 50%),
          #f8f9fa
        `,
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">One More Step!</h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="institution"
                className="text-sm font-medium text-gray-700"
              >
                Institution*
              </Label>
              <select
                id="institution"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              >
                <option value="cbit">
                  Chaitanya Bharati Institute of Technology
                </option>
                <option value="other">Other Institution</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                State*
              </Label>
              <select
                id="state"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="telangana">Telangana</option>
                <option value="andhra-pradesh">Andhra Pradesh</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="graduation-year"
                className="text-sm font-medium text-gray-700"
              >
                Graduation Year*
              </Label>
              <select
                id="graduation-year"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            {/* Phone number field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number*
              </Label>
              <PhoneInput
                id="phone"
                value={phone}
                onChange={setPhone}
                defaultCountry="IN"
                international
                countryCallingCodeEditable={false}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="id-image"
                className="text-sm font-medium text-gray-700"
              >
                Upload ID Image*
              </Label>
              <input
                id="id-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              {idImageUrl && (
                <div className="mt-2 text-xs text-green-600">
                  Image uploaded!
                </div>
              )}
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
              style={{ color: "#c4f542" }}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Continue"}
            </Button>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => router.push('/home')}
                className="text-sm text-blue-600 hover:underline"
              >
                Skip For Now
              </button>
            </div>
          </div>
        </form>
        {/* ...footer... */}
        <div className="mt-8 pt-6 border-t border-gray-200 font-sans font-bold">
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <Link href="/support" className="hover:text-gray-900">
              Support
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-900">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
