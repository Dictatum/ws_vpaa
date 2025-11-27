import { type NextRequest, NextResponse } from "next/server"

// Mock database
const events: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const event = events.find((e) => e.id === params.id)
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }
  return NextResponse.json(event)
}
