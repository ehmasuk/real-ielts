import type { Metadata } from "next"
import Script from "next/script"
import { Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { NextAuthProvider } from "@/providers/session-provider"
import { Toaster } from "sonner"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Real IELTS — Practice for the Computer-Delivered IELTS Exam",
    template: "%s | Real IELTS",
  },
  description:
    "Train under real exam conditions with Cambridge IELTS practice tests. Access comprehensive mocks from Cambridge series 16–21, get instant band score diagnostics, and clear explanations for every error.",
  keywords: [
    "IELTS",
    "IELTS practice",
    "Cambridge IELTS",
    "CD-IELTS",
    "IELTS preparation",
    "IELTS online",
    "exam simulation",
    "IELTS band score",
    "IELTS listening practice",
    "IELTS reading practice",
    "IELTS writing practice",
    "IELTS speaking practice",
  ],
  authors: [{ name: "Real IELTS" }],
  creator: "Real IELTS",
  publisher: "Real IELTS",
  metadataBase: new URL("https://real-ielts.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Real IELTS",
    title: "Real IELTS — Practice for the Computer-Delivered IELTS Exam",
    description:
      "Train under real exam conditions with Cambridge IELTS practice tests. Access comprehensive mocks from Cambridge series 16–21, get instant band score diagnostics, and clear explanations for every error.",
    url: "https://real-ielts.vercel.app",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Real IELTS — Practice for the Computer-Delivered IELTS Exam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real IELTS — Practice for the Computer-Delivered IELTS Exam",
    description:
      "Train under real exam conditions with Cambridge IELTS practice tests. Access comprehensive mocks from Cambridge series 16–21, get instant band score diagnostics, and clear explanations for every error.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://real-ielts.vercel.app",
  },
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <head>
        <Script
          id="theme-setup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=localStorage.getItem("theme");var t=window.matchMedia("(prefers-color-scheme: dark)").matches;var n=e==="system"||!e?(t?"dark":"light"):e;document.documentElement.classList.add(n);document.documentElement.style.colorScheme=n}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <NextAuthProvider>
          <QueryProvider>
            <ThemeProvider>
              {children}
              <Toaster richColors position="top-right" />
            </ThemeProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
