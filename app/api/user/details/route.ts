import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. First try to find user directly in the students collection
    const user = await db.collection("students").findOne({ email });
    
    if (user) {
      return NextResponse.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.image,
        ...(user.headline && { headline: user.headline }),
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        ...(user.portfolio && { portfolio: user.portfolio }),
        ...(user.linkedin && { linkedin: user.linkedin }),
        ...(user.github && { github: user.github }),
        ...(user.phone && { phone: user.phone }),
        ...(user.location && { location: user.location })
      });
    }

    // 2. If not found, try to find in gigs collection
    const gigWithApplicant = await db.collection("gigs").findOne({
      "applicants.student.email": email
    });

    if (gigWithApplicant?.applicants) {
      const applicant = gigWithApplicant.applicants.find(
        (app: any) => app.student?.email === email
      );

      if (applicant?.student) {
        return NextResponse.json({
          _id: applicant.student._id,
          name: applicant.student.name,
          email: applicant.student.email,
          ...(applicant.student.profileImage && { 
            image: applicant.student.profileImage 
          })
        });
      }
    }

    // 3. If we get here, user was not found
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error("Error in /api/user/details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
