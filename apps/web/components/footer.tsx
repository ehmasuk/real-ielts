"use client"

import { useState } from "react"
import Link from "next/link"
import { Bug } from "lucide-react"
import { Logo } from "@/components/Logo"
import { ReportBugModal } from "@/components/ReportBugModal"

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
    <footer className="w-full border-t border-border/40 bg-muted/30 dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Practice computer-delivered IELTS exam simulation with real-time feedback, band score estimation, and direct mistakes analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/40 cursor-not-allowed select-none">
                      {link.label}
                      <span className="rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground/50 border border-border/20 whitespace-nowrap">
                        Coming Soon
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Real IELTS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline inline-flex items-center gap-1" onClick={(e) => { e.preventDefault(); setReportOpen(true) }}> <Bug className="h-3 w-3" /> Report Bug</Link>
          </div>
        </div>

      </div>
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </footer>
  )
}
