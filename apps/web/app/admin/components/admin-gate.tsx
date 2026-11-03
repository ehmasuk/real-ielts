"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"

/**
 * Wraps the admin layout. Renders children only for authenticated admins;
 * everyone else (logged out, "student" role, or role pending) is redirected
 * to the homepage instead of ever rendering the admin shell.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const isAdmin = isAuthenticated && user?.role === "admin"
  const [redirecting, setRedirecting] = React.useState(false)

  React.useEffect(() => {
    // Wait for the session to resolve before deciding, then send
    // non-admins home (covers signed-out users immediately after logout).
    if (!isLoading && !isAdmin) {
      setRedirecting(true)
      router.replace("/")
    }
  }, [isLoading, isAdmin, router])

  if (isLoading || redirecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
