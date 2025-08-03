import { supabase } from "./supabase"

export const demoUsers = [
  { email: "admin@medsync.com", password: "password123", role: "Admin" },
  { email: "doctor1@medsync.com", password: "password123", role: "Doctor" },
  { email: "doctor2@medsync.com", password: "password123", role: "Doctor" },
  { email: "receptionist@medsync.com", password: "password123", role: "Receptionist" },
  { email: "pharmacist@medsync.com", password: "password123", role: "Pharmacist" },
  { email: "lab@medsync.com", password: "password123", role: "Lab Technician" },
]

export async function createSingleDemoUser(email: string, password: string) {
  try {
    // Try to sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        // User exists, verify credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!signInError) {
          await supabase.auth.signOut()
          return { success: true, message: "User already exists and credentials verified" }
        } else {
          return { success: false, message: `User exists but credentials don't match: ${signInError.message}` }
        }
      } else {
        return { success: false, message: error.message }
      }
    }

    return {
      success: true,
      message: data.user?.email_confirmed_at ? "User created and confirmed" : "User created successfully",
    }
  } catch (err: any) {
    return { success: false, message: err.message || "Unknown error" }
  }
}

export async function createAllDemoUsers() {
  const results = []

  for (const user of demoUsers) {
    const result = await createSingleDemoUser(user.email, user.password)
    results.push({
      email: user.email,
      role: user.role,
      ...result,
    })

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return results
}
