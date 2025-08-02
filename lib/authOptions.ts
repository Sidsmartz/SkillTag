import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SessionStrategy } from "next-auth";
import mongoose from "mongoose";
import Student from "../models/Student";

// Connect to MongoDB using Mongoose
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    return mongoose.connections[0];
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async signIn({ user }: { user: any }) {
      try {
        await connectToDatabase();
        const existingStudent = await (Student as any).findOne({ email: user.email });

        if (!existingStudent) {
          // Create a new student if they don't exist
          const newStudent = new (Student as any)({
            name: user.name,
            email: user.email,
            image: user.image,
            applications: [],
          });
          await newStudent.save();
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Prevent sign-in on error
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};