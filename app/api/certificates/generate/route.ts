import { createServerSupabaseClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { attendeeId, eventId } = await request.json()

  if (!attendeeId || !eventId) {
    return NextResponse.json({ error: "Missing attendeeId or eventId" }, { status: 400 })
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Get attendee details
    const { data: attendee, error: attendeeError } = await supabase
      .from("attendees")
      .select("*")
      .eq("id", attendeeId)
      .single()

    if (attendeeError || !attendee) {
      return NextResponse.json({ error: "Attendee not found" }, { status: 404 })
    }

    // Get event details
    const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", eventId).single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if certificate already issued
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("*")
      .eq("attendee_id", attendeeId)
      .eq("event_id", eventId)
      .single()

    if (existingCert) {
      return NextResponse.json({ certificate: existingCert })
    }

    // Create certificate
    const certificateNumber = `VPAA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .insert([
        {
          attendee_id: attendeeId,
          event_id: eventId,
          certificate_number: certificateNumber,
          issued_date: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (certError) {
      return NextResponse.json({ error: certError.message }, { status: 500 })
    }

    // Update attendee to mark certificate as issued
    await supabase
      .from("attendees")
      .update({
        certificate_issued: true,
        certificate_issue_date: new Date().toISOString(),
      })
      .eq("id", attendeeId)

    return NextResponse.json({
      certificate: {
        ...certificate,
        attendeeName: `${attendee.first_name} ${attendee.last_name}`,
        eventName: event.name,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate certificate" }, { status: 500 })
  }
}
