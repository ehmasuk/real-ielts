import { useEffect, useCallback } from "react"
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { setAccessToken } from "@/lib/token-manager"

type User = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  backendId?: string
}

export function useAuth() {
  const { data, status } = useSession()
  const isPending = status === "loading"

  useEffect(() => {
    if (data?.user?.accessToken) {
      setAccessToken(data.user.accessToken)
    } else {
      setAccessToken(null)
    }
  }, [data?.user?.accessToken])

  const signIn = useCallback((callbackURL?: string) => {
    nextAuthSignIn("google", callbackURL ? { callbackUrl: callbackURL } : undefined)
  }, [])

  const signOut = useCallback(async () => {
    await nextAuthSignOut()
    setAccessToken(null)
  }, [])

  return {
    user: data?.user ? (data.user as User) : null,
    isLoading: isPending,
    isAuthenticated: !!data?.user,
    signIn,
    signOut,
  }
}
