import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const hdrs = await headers()

  const session = await auth.api.getSession({
    headers: hdrs,
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { user } = session

  const apiUri = process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080/api"
  const apiKey = process.env.INTERNAL_API_KEY

  const res = await fetch(`${apiUri}/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": apiKey || "",
    },
    body: JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.image,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Sync failed" }))
    return NextResponse.json({ error: err.message }, { status: res.status })
  }

  const data = await res.json()
  const mongoRole = data?.data?.user?.role

  if (mongoRole) {
    const updateRes = await auth.api.updateUser({
      body: { role: mongoRole } as never,
      headers: hdrs,
      request,
      asResponse: true,
    }) as unknown as Response

    const jsonRes = NextResponse.json(data)
    const setCookies = updateRes.headers.getSetCookie?.() ?? []
    for (const cookie of setCookies) {
      jsonRes.headers.append("Set-Cookie", cookie)
    }
    return jsonRes
  }

  return NextResponse.json(data)
}
