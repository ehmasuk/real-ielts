import { useEffect, useRef, useCallback, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { setAccessToken } from "@/lib/token-manager"
import { syncUserWithBackend } from "@/lib/api"

type User = {
  id: string
  name: string
  email: string
  image?: string
  emailVerified?: boolean
  picture?: string
  role?: string
}

export function useAuth() {
  const { data, isPending } = authClient.useSession()
  const [isSyncing, setIsSyncing] = useState(false)
  const syncedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!data?.user) return
    if (syncedUserId.current === data.user.id) return
    syncedUserId.current = data.user.id

    const sync = async () => {
      setIsSyncing(true)
      try {
        const res = await syncUserWithBackend({
          sub: data.user.id,
          email: data.user.email,
          name: data.user.name,
          picture: data.user.image,
        })
        setAccessToken(res.data.token)

        const role = res.data.user?.role
        if (role) {
          await fetch("/api/auth/sync-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          })
        }
      } catch {
        setAccessToken(null)
      } finally {
        setIsSyncing(false)
      }
    }

    sync()
  }, [data])

  const signIn = useCallback(() => {
    authClient.signIn.social({ provider: "google" })
  }, [])

  const signOut = useCallback(async () => {
    await authClient.signOut()
    syncedUserId.current = null
    setAccessToken(null)
  }, [])

  return {
    user: (data?.user as User) ?? null,
    isLoading: isPending || isSyncing,
    isAuthenticated: !!data?.user,
    signIn,
    signOut,
  }
}
