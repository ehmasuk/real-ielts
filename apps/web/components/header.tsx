"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/providers/theme-provider"
import { BookOpen, Moon, Sun, Menu, X, Headphones, PenTool, Mic, LogOut, User, ChevronDown, Mail, Layers } from "lucide-react"
import { Logo } from "@/components/Logo"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useAuth } from "@/lib/use-auth"

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  disabled?: boolean
  badge?: string
}

const navLinks: NavLink[] = [
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/writing", label: "Writing", icon: PenTool, disabled: true },
  { href: "/speaking", label: "Speaking", icon: Mic, disabled: true },
]

// SSR-safe client detection — avoids set-state-in-effect lint warning
const subscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}







export const Header = React.memo(function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()
  const { isAuthenticated, user, signIn, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  navLinks.some((l) => !l.disabled && pathname.startsWith(l.href))
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className={`h-4 w-4 ${
                  navLinks.some((l) => !l.disabled && pathname.startsWith(l.href))
                    ? "text-primary"
                    : "text-muted-foreground/75"
                }`} />
                Practice Tests
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-48 p-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon
                if (link.disabled) {
                  return (
                    <div
                      key={link.label}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
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
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"}`} />
                    {link.label}
                  </Link>
                )
              })}
            </HoverCardContent>
          </HoverCard>
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

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-lg border border-border/40 px-2">
                  <Avatar className="size-8">
                    <AvatarImage src={user.picture || user.image || undefined} alt={user.name ?? undefined} referrerPolicy="no-referrer" />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name ?? "User"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3" />
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <User className="size-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="font-semibold text-sm" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
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
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
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
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Practice Tests</p>
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
                    <span className="ml-auto rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground/50 border border-border/20 whitespace-nowrap">
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
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon className={`h-4 w-4 ${pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"}`} />
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="size-9">
                    <AvatarImage src={user.picture || user.image || undefined} alt={user.name ?? undefined} referrerPolicy="no-referrer" />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name ?? "User"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="lg" className="w-full justify-center">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="lg" className="w-full justify-center" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="lg" className="w-full justify-center" onClick={() => signIn()}>
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
})
