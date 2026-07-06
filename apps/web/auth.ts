import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      backendId?: string
      accessToken?: string
    }
  }
}

// @ts-ignore
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const apiUri = process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080/api"
          const res = await fetch(`${apiUri}/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-api-key": process.env.INTERNAL_API_KEY || "",
            },
            body: JSON.stringify({
              sub: user.id,
              email: user.email,
              name: user.name,
              picture: user.image,
            }),
          })
          if (res.ok) {
            const result = await res.json()
            token.accessToken = result.data?.token || result.token
            token.role = result.data?.user?.role || result.user?.role
            token.backendId = result.data?.user?.id || result.user?.id
          } else {
            throw new Error(`Backend sync failed: ${res.statusText}`)
          }
        } catch (error) {
          console.error("Failed to sync user with backend:", error)
          throw new Error("Authentication failed due to backend synchronization error")
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string | undefined
        session.user.backendId = token.backendId as string | undefined
        session.user.accessToken = token.accessToken as string | undefined
      }
      return session
    },
  },
})
