"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import {
  Menu,
  Moon,
  Sun,
  ChevronRight,
  ExternalLink,
  LogOut,
  ChevronDown,
  Mail,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
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

// SSR-safe client detection
const subscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

// Generate breadcrumbs from pathname
function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  return segments.map((segment, idx) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }))
}

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()
  const { user, signOut } = useAuth()
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onMenuToggle}
        className="lg:hidden rounded-lg border border-border/40"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            {crumb.href !== "/admin" && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            )}
            {crumb.isLast ? (
              <span className="font-semibold text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5">

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-lg border border-border/40 px-2">
                <Avatar className="size-7">
                  <AvatarImage src={user.picture || user.image} alt={user.name} />
                  <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm text-muted-foreground">{user.name}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3" />
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Theme toggle */}
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

        {/* View site link */}
        <Link href="/" target="_blank">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-lg border border-border/40"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
