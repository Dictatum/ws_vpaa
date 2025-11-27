import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const token = authHeader.replace("Bearer ", "")
    const userData = JSON.parse(Buffer.from(token, "base64").toString())
    return NextResponse.json({
      id: "1",
      full_name: userData.name || "User",
      email: userData.email,
      role: userData.role,
    })
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
