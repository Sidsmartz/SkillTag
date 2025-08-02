import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    // Return referredPeople array, or empty array if not present
    return NextResponse.json({ referredPeople: student.referredPeople || [] });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}
