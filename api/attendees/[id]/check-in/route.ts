import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Mock check-in update
  return NextResponse.json({
    id: params.id,
    status: "checked_in",
    check_in_time: new Date().toISOString(),
  })
}
