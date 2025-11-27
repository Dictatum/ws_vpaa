import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { attendeeId, eventId } = await request.json()

  const certificate = {
    id: Math.random().toString(36).substr(2, 9),
    attendee_id: attendeeId,
    event_id: eventId,
    certificate_number: `VPAA-${Date.now()}`,
    issued_date: new Date().toISOString(),
    pdf_url: "/certificates/sample.pdf",
  }

  return NextResponse.json(certificate)
}
