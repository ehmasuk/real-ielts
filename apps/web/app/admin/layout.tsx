"use client"

import * as React from "react"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Sheet, SheetContent } from "@workspace/ui/components/sheet"
import { AdminSidebar } from "./components/admin-sidebar"
import { AdminHeader } from "./components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const closeMobile = React.useCallback(() => {
    setMobileOpen(false)
  }, [])

  const toggleMobile = React.useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
        </div>

        {/* Mobile sidebar (Sheet) */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[260px] p-0">
            <AdminSidebar
              collapsed={false}
              onToggle={closeMobile}
            />
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onMenuToggle={toggleMobile} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
