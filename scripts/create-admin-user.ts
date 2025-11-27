import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log("[v0] Creating admin user...")

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
      return
    }

    console.log("[v0] Admin user created successfully!")
    console.log("[v0] User ID:", data.user?.id)
    console.log("[v0] Email:", data.user?.email)

    // Also insert into custom users table if needed
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user?.id,
      email: "vpaa-admin@gmail.com",
      full_name: "VPAA Administrator",
      role: "admin",
      email_confirmed_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("[v0] Error creating user profile:", profileError.message)
    } else {
      console.log("[v0] User profile created successfully!")
    }
  } catch (error: any) {
    console.error("[v0] Unexpected error:", error.message)
  }
}

createAdminUser()
