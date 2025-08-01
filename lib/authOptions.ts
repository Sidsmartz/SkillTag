import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";
import { SessionStrategy } from "next-auth";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "waitlist";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  if (!uri) throw new Error("MONGODB_URI not set");
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export const authOptions = {
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
        const client = await connectToDatabase();
        const db = client.db(); // Use the default DB from the connection string
        const studentsCollection = db.collection("students");

        const existingStudent = await studentsCollection.findOne({ email: user.email });

        if (!existingStudent) {
          // Create a new student if they don't exist
          await studentsCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
            updatedAt: new Date(),
            onboardingComplete: false, // Default onboarding status
            applications: [],
          });
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