import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the student document by email
    const student = await db
      .collection("students")
      .findOne({ email: session.user.email });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: student,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch student data",
      },
      { status: 500 }
    );
  }
}
