"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Headphones,
  MessageSquare,
  PenLine,
  Upload,
  ShieldCheck,
  ChevronLeft,
  Bug,
  Users,
} from "lucide-react"
import { Logo } from "@/components/Logo"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useAuth } from "@/lib/use-auth"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: "",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/books", label: "Books", icon: BookOpen },
      { href: "/admin/tests", label: "All Tests", icon: FileText },
    ],
  },
    {
      title: "Operations",
      items: [
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/imports", label: "Imports", icon: Upload },
        { href: "/admin/bug-reports", label: "Bug Reports", icon: Bug },
      ],
    },
  {
    title: "Schemas",
    items: [
      { href: "/admin/schemas/listening", label: "Listening Schema", icon: Headphones },
      { href: "/admin/schemas/reading", label: "Reading Schema", icon: BookOpen },
      { href: "/admin/schemas/writing", label: "Writing Schema", icon: PenLine },
      { href: "/admin/schemas/speaking", label: "Speaking Schema", icon: MessageSquare },
    ],
  },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export const AdminSidebar = React.memo(function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = React.useCallback((href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }, [pathname])

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/40 bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2.5 transition-all",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <Logo variant="short" />
          ) : (
            <div className="flex flex-col items-start">
              <Logo />
              <span className="text-[10px] font-medium text-muted-foreground -mt-0.5">Admin Panel</span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navGroups.map((group, groupIdx) => (
            <div key={group.title || `group-${groupIdx}`}>
              {group.title && !collapsed && (
                <div className="mb-1.5 mt-4 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.title}
                </div>
              )}
              {group.title && collapsed && groupIdx > 0 && (
                <Separator className="my-3 opacity-30" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                const isSoon = item.badge === "Soon"

                const linkContent = (
                  <Link
                    href={isSoon ? "#" : item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      isSoon && "pointer-events-none opacity-40",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={isSoon ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active
                          ? "text-indigo-500 dark:text-indigo-400"
                          : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground/60">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.href} delayDuration={0}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return <React.Fragment key={item.href}>{linkContent}</React.Fragment>
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle (when collapsed) */}
      {collapsed && (
        <div className="border-t border-border/40 p-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className="mx-auto flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      )}

      {/* Bottom section */}
      {!collapsed && (
        <div className="border-t border-border/40 p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-2.5">
            <Avatar className="size-8">
              <AvatarImage src={mounted ? (user?.picture || user?.image || undefined) : undefined} alt={mounted ? user?.name ?? undefined : undefined} />
              <AvatarFallback className="text-xs font-bold">{mounted && user?.name ? user.name.charAt(0).toUpperCase() : "A"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{mounted && user?.name ? user.name : "Admin"}</p>
              <p className="truncate text-[10px] text-muted-foreground">{mounted && user?.role ? user.role : "admin"}</p>
            </div>
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          </div>
        </div>
      )}
    </aside>
  )
})
