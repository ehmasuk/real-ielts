import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { role } = body

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 })
  }

  const updated = await auth.api.updateUser({
    body: { role },
    headers: await headers(),
  })

  return NextResponse.json({ status: true, user: updated })
}
