import { auth } from "@/auth"
import { NextResponse } from "next/server"

const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/api/auth/signin", nextUrl))
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export default proxy as any

export const config = {
  matcher: ["/admin/:path*"],
}
