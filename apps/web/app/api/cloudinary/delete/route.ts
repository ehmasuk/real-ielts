import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const CLOUD_NAME = process.env.NEXT_PUBLIC_COUDINARY_CLOUD_NAME || ""
const API_KEY = process.env.NEXT_PUBLIC_COUDINARY_API_KEY || ""
const API_SECRET = process.env.CLOUDINARY_API_SECRET || ""
const JWT_SECRET = process.env.JWT_SECRET || ""

const RESOURCE_TYPE_MAP: Record<string, string> = {
  audio: "video",
  image: "image",
  video: "video",
  document: "raw",
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    // Fail fast on garbage tokens before making a network call; the API
    // re-validates the signature anyway.
    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // The JWT is valid for 30 days, so its role claim can go stale (e.g. a
    // demoted admin). Confirm the current role with the API's /auth/me,
    // which re-checks status and role against the database. Fail closed on
    // any network error.
    const apiUri = process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080/api"
    let currentRole: string | undefined
    try {
      const meRes = await fetch(`${apiUri}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (meRes.ok) {
        const meResult = await meRes.json()
        currentRole = meResult?.data?.role
      }
    } catch {
      // Network failure — treat as unauthorized below.
    }
    if (currentRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { public_id, type } = await request.json()

    if (!public_id || !type) {
      return NextResponse.json({ error: "public_id and type are required" }, { status: 400 })
    }

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json({ error: "Cloudinary configuration is missing" }, { status: 500 })
    }

    const resourceType = RESOURCE_TYPE_MAP[type] || "raw"
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")

    const baseUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}/upload`

    const response = await fetch(baseUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_ids: [public_id] }),
    })

    const text = await response.text()
    let data: any = {}
    try {
      data = JSON.parse(text)
    } catch {}

    if (!response.ok) {
      const message = data.error?.message || data.error || `Cloudinary returned ${response.status}`
      return NextResponse.json({ error: message }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error deleting from Cloudinary:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
