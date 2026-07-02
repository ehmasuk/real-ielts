"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

const quickLinks = [
  { href: "/listening", label: "Listening" },
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/30 dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                Real IELTS
              </span>
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
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Real IELTS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
