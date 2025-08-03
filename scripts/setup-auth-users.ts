import { createClient } from "@supabase/supabase-js"

// This script should be run with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key needed

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const demoUsers = [
  { email: "admin@medsync.com", password: "password123" },
  { email: "doctor1@medsync.com", password: "password123" },
  { email: "doctor2@medsync.com", password: "password123" },
  { email: "receptionist@medsync.com", password: "password123" },
  { email: "pharmacist@medsync.com", password: "password123" },
  { email: "lab@medsync.com", password: "password123" },
]

async function createDemoUsers() {
  console.log("Creating demo users...")

  for (const user of demoUsers) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
      } else {
        console.log(`✅ Created user: ${user.email}`)
      }
    } catch (err) {
      console.error(`Failed to create user ${user.email}:`, err)
    }
  }

  console.log("Demo users creation completed!")
}

// Run the script
createDemoUsers()
