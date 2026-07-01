"use client"

import * as React from "react"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@workspace/ui/components/button"

export default function SignInPage() {
  const { signIn, isLoading, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/"
    }
  }, [isAuthenticated])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h1>
        <p className="text-sm text-muted-foreground">Sign in with Google to access the admin panel</p>
        <Button onClick={() => signIn()} disabled={isLoading} size="lg" className="w-full">
          {isLoading ? "Loading..." : "Sign in with Google"}
        </Button>
      </div>
    </div>
  )
}
