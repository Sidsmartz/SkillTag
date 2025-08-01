import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}

export const requireAuth = async () => {
  const user = await getCurrentUser()
  if (!user?.email) {
    throw new Error("Not authenticated")
  }
  return user
}
