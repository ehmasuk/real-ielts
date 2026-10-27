"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/providers/theme-provider"
import {
  BookOpen,
  ChevronDown,
  Headphones,
  LogOut,
  Mail,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react"
import { Logo } from "@/components/Logo"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useAuth } from "@/lib/use-auth"

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const navLinks: NavLink[] = [
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/reading", label: "Reading", icon: BookOpen },
]

// SSR-safe client detection — avoids set-state-in-effect lint warning
const subscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

/* Pen underline shared with the homepage's notebook world — the ink draws
   in from the left on hover and stays down on the active section. */
const penCss = `
.pen-link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1.5px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.pen-link:hover, .pen-link:focus-visible, .pen-link-active { background-size: 100% 1.5px; }
@media (prefers-reduced-motion: reduce) { .pen-link { transition: none; } }
`

export const Header = React.memo(function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()
  const { isAuthenticated, user, signIn, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  // Match the container grid of the page underneath so brand and links
  // line up with the page's own left/right edges.
  const containerWidth = pathname === "/" ? "max-w-6xl" : "max-w-7xl"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-[#fbfaf8] dark:border-zinc-800 dark:bg-[#0c0c0e]">
      <style>{penCss}</style>
      <div
        className={cn(
          "relative mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8",
          containerWidth
        )}
      >
        {/* Brand — icon only, flush left */}
        <Link href="/" aria-label="Real IELTS — home" className="shrink-0">
          <Logo variant="full" />
        </Link>

        {/* Primary links — true center of the bar */}
        <nav
          className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
          aria-label="Practice tests"
        >
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pen-link py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]",
                  active
                    ? "pen-link-active text-red-600 dark:text-red-400"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title="Toggle theme (Hotkey: D)"
            className="rounded-[3px] border border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 gap-1.5 rounded-[3px] border border-zinc-300 px-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <Avatar className="size-7">
                    <AvatarImage src={user.picture || user.image || undefined} alt={user.name ?? undefined} referrerPolicy="no-referrer" />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3.5 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-[3px]">
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
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-[3px] border border-zinc-300 px-4 text-[13px] font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-[3px] border border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-lg"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-[3px] border border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden animate-in fade-in slide-in-from-top-2 border-t border-zinc-200 bg-[#fbfaf8] px-4 py-4 duration-200 dark:border-zinc-800 dark:bg-[#0c0c0e]"
        >
          <nav className="flex flex-col" aria-label="Practice tests">
            <p className="px-1 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Practice tests
            </p>
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[3px] px-1 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-1 py-1">
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
                    <Button variant="outline" size="lg" className="w-full justify-center rounded-[3px]">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="lg" className="w-full justify-center rounded-[3px]" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="lg" className="w-full justify-center rounded-[3px]" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
})
