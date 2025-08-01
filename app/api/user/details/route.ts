import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");
    
    if (!email && !userId) {
      return NextResponse.json(
        { error: "Either email or userId query parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    let user = null;

    // 1. First try to find user by ID if provided
    if (userId) {
      try {
        const { ObjectId } = await import('mongodb');
        user = await db.collection("students").findOne({ _id: new ObjectId(userId) });
      } catch (error) {
        console.error('Error finding user by ID:', error);
        return NextResponse.json(
          { error: "Invalid user ID format" },
          { status: 400 }
        );
      }
    } 
    // 2. If no user found by ID or no ID provided, try by email
    if (!user && email) {
      user = await db.collection("students").findOne({ email });
    }
    
    if (user) {
      return NextResponse.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        about: user.about,
        ...(user.headline && { headline: user.headline }),
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        ...(user.portfolio && { portfolio: user.portfolio }),
        ...(user.linkedin && { linkedin: user.linkedin }),
        ...(user.github && { github: user.github }),
        ...(user.phone && { phone: user.phone }),
        ...(user.location && { location: user.location }),
        ...(user.dateOfBirth && { dateOfBirth: user.dateOfBirth }),
        ...(user.gender && { gender: user.gender })
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
  try {
    const { requireAuth } = await import('@/lib/auth');
    const user = await requireAuth();
    
    const updates = await req.json();
    
    // Validate required fields
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Only allow certain fields to be updated
    const allowedUpdates = [
      'name',
      'headline',
      'about',
      'skills',
      'experience',
      'education',
      'portfolio',
      'linkedin',
      'github',
      'phone',
      'location',
      'dateOfBirth',
      'gender',
      'onboardingComplete',
      'profileComplete'
    ];

    // Filter updates to only include allowed fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Update the user in the database
    const result = await db.collection("students").updateOne(
      { email: user.email },
      { $set: filteredUpdates },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      modifiedCount: result.modifiedCount
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    if (error.message === "Not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
