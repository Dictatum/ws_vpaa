import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log("[v0] Creating admin user...")

    // First, check if user already exists
    const { data: existingUsers } = await supabase.from("users").select("*").eq("email", "vpaa-admin@gmail.com")

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ message: "Admin user already exists", user: existingUsers[0] }, { status: 200 })
    }

    // Create the admin user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: "vpaa-admin@gmail.com",
      password: "vpaaadmin123",
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: "admin",
        full_name: "VPAA Administrator",
      },
    })

    if (error) {
      console.error("[v0] Error creating admin user:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] Admin user created successfully!")

    // Also insert into custom users table
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: data.user?.id,
        email: "vpaa-admin@gmail.com",
        full_name: "VPAA Administrator",
        role: "admin",
        email_confirmed_at: new Date().toISOString(),
      })
      .select()

    if (profileError) {
      console.error("[v0] Error creating user profile:", profileError.message)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "Admin user created successfully!",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: "admin",
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Unexpected error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
