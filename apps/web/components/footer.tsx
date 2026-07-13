"use client"

import { ReportBugModal } from "@/components/ReportBugModal"
import { Bug } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface FooterLink {
  href: string
  label: string
  disabled?: boolean
}

const quickLinks: FooterLink[] = [
  { href: "/listening", label: "Listening" },
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing", disabled: true },
  { href: "/speaking", label: "Speaking", disabled: true },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  const [reportOpen, setReportOpen] = useState(false)
  return (
    <footer className="w-full bg-muted/30 dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Bottom Panel */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {currentYear} Real IELTS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-1 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                setReportOpen(true)
              }}
            >
              {" "}
              <Bug className="h-3 w-3" /> Report Bug
            </Link>
          </div>
        </div>
      </div>
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </footer>
  )
}
