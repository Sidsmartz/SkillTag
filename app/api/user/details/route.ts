import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email query param required" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Return relevant user details
    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      // Include additional profile fields that companies might need to see
      headline: user.headline,
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      github: user.github,
      phone: user.phone,
      location: user.location
    });
  } catch (error) {
    console.error("Error fetching user details", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  const details = await req.json();
  console.log(details);
  const client = await clientPromise;
  const db = client.db("waitlist");
  console.log(session.user.email);
  console.log(db);
  const result = await db
    .collection("users")
    .updateOne({ email: session.user.email }, { $set: { ...details } });
  console.log(
    "Matched:",
    result.matchedCount,
    "Modified:",
    result.modifiedCount
  );
  return new Response("Details updated", { status: 200 });
}
