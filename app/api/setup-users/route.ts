import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY not found. User creation API will not work.")
}

const demoUsers = [
  { email: "admin@medsync.com", password: "password123" },
  { email: "doctor1@medsync.com", password: "password123" },
  { email: "doctor2@medsync.com", password: "password123" },
  { email: "receptionist@medsync.com", password: "password123" },
  { email: "pharmacist@medsync.com", password: "password123" },
  { email: "lab@medsync.com", password: "password123" },
]

export async function POST() {
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 })
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const results = []

    for (const user of demoUsers) {
      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (error) {
          results.push({
            email: user.email,
            success: false,
            message: error.message,
          })
        } else {
          results.push({
            email: user.email,
            success: true,
            message: "User created successfully",
          })
        }
      } catch (err: any) {
        results.push({
          email: user.email,
          success: false,
          message: err.message || "Unknown error",
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create users" }, { status: 500 })
  }
}
