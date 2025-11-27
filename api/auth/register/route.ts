import { createServerSupabaseClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, password, fullName } = await request.json()

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
