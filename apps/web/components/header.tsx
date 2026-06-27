"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { BookOpen, Moon, Sun, Menu, X, GraduationCap, Headphones, PenTool, Mic } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  disabled?: boolean
  badge?: string
}

// SSR-safe client detection — avoids set-state-in-effect lint warning
const subscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks: NavLink[] = [
    { href: "/listening", label: "Listening", icon: Headphones },
    { href: "/reading", label: "Reading", icon: BookOpen, disabled: true },
    { href: "/writing", label: "Writing", icon: PenTool, disabled: true },
    { href: "/speaking", label: "Speaking", icon: Mic, disabled: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Real IELTS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            if (link.disabled) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
                  title={`${link.label} - Coming Soon`}
                >
                  <Icon className="h-4 w-4 text-muted-foreground/30" />
                  {link.label}
                  <span className="ml-1 rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground/50 border border-border/20">
                    Soon
                  </span>
                </div>
              )
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-muted-foreground/75 transition-colors group-hover:text-primary" />
                {link.label}
                {link.badge && (
                  <span className="ml-1 rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title="Toggle theme (Hotkey: D)"
            className="rounded-lg border border-border/40"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="sm" className="font-semibold text-sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-linear-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500">
            Start Free Practice
          </Button>
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-lg border border-border/40"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-border/40"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              if (link.disabled) {
                return (
                  <div
                    key={link.label}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground/30" />
                    {link.label}
                    <span className="ml-auto rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground/50 border border-border/20">
                      Soon
                    </span>
                  </div>
                )
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {link.label}
                  {link.badge && (
                    <span className="ml-auto rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              <Button variant="outline" size="lg" className="w-full justify-center">
                Sign In
              </Button>
              <Button size="lg" className="w-full justify-center bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                Start Free Practice
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
