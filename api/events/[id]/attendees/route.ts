import { type NextRequest, NextResponse } from "next/server"

// Mock database
const attendees: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(attendees.filter((a) => a.event_id === params.id))
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const attendee = {
    id: Math.random().toString(36).substr(2, 9),
    event_id: params.id,
    ...body,
    status: "registered",
    certificate_issued: false,
    created_at: new Date().toISOString(),
  }

  attendees.push(attendee)
  return NextResponse.json(attendee)
}
