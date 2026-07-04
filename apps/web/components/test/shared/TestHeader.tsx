"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { Settings2, User } from "lucide-react"

export const TestHeader = React.memo(function TestHeader({
  sectionTitle,
  partNum,
}: {
  sectionTitle: string
  partNum: number
}) {
  const { user, signIn, signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-black tracking-tight">
            REAL IELTS
          </Link>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm font-bold text-foreground">
            {sectionTitle} — Part {partNum}
          </span>
        </div>

        <div className="relative flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {user.name ?? user.email}
                <Settings2 className="h-3 w-3" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 border border-border bg-background shadow-lg">
                  <div className="border-b border-border/40 px-4 py-2 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setUserMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
})
