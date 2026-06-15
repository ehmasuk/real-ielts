"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { BookOpen, Moon, Sun, Menu, X, Award, Flame, GraduationCap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/", label: "Practice Tests", icon: BookOpen },
    { href: "#", label: "Full Mock Exams", icon: GraduationCap },
    { href: "#", label: "Writing Evaluator", icon: Award },
    { href: "#", label: "Daily Challenge", icon: Flame, badge: "New" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Real IELTS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
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
          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500">
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
              <Button size="lg" className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Start Free Practice
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
