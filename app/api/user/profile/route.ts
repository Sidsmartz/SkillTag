import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Log every request method
export async function middleware(req: Request) {
  console.log('API method:', req.method);
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();
    const student = await db
      .collection("students")
      .findOne({ email: session.user.email });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    // Only return relevant profile fields
    const profile = {
      name: student.name || "",
      email: student.email || "",
      image: student.image || "",
      description: student.description || "",
      status: student.status || "available",
      skills: student.skills || [],
      gender: student.gender || "",
      dateOfBirth: student.dateOfBirth || "",
      phone: student.phone || "",
      referredBy: student.referredBy || null,
    };
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
