import { type NextRequest, NextResponse } from "next/server"

// Mock database
const events: any[] = []

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const event = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    created_at: new Date().toISOString(),
  }

  events.push(event)
  return NextResponse.json(event)
}
