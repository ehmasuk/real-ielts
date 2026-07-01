import { useEffect, useRef, useCallback, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { setAccessToken } from "@/lib/token-manager"

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
  const [syncedRole, setSyncedRole] = useState<string | null>(null)
  const syncedUserId = useRef<string | null>(null)


  useEffect(() => {
    if (!data?.user) return
    if (syncedUserId.current === data.user.id) return

    syncedUserId.current = data.user.id

    const sync = async () => {
      setIsSyncing(true)
      try {
        const res = await fetch("/api/auth-sync", { method: "POST" })
        if (!res.ok) throw new Error("Sync failed")
        const json = await res.json()
        setAccessToken(json.data?.token ?? null)
        setSyncedRole(json.data?.user?.role ?? null)
      } catch {
        setAccessToken(null)
      } finally {
        setIsSyncing(false)
      }
    }

    sync()
  }, [data?.user?.id])

  const signIn = useCallback((callbackURL?: string) => {
    authClient.signIn.social({
      provider: "google",
      ...(callbackURL ? { callbackURL } : {}),
    })
  }, [])

  const signOut = useCallback(async () => {
    await authClient.signOut()
    syncedUserId.current = null
    setAccessToken(null)
    setSyncedRole(null)
  }, [])

  return {
    user: data?.user
      ? { ...(data.user as User), role: syncedRole ?? (data.user as User).role }
      : null,
    isLoading: isPending || isSyncing,
    isAuthenticated: !!data?.user,
    signIn,
    signOut,
  }
}
