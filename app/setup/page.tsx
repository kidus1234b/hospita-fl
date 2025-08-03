"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Hospital, CheckCircle, XCircle } from "lucide-react"

const demoUsers = [
  { email: "admin@medsync.com", password: "password123", role: "Admin" },
  { email: "doctor1@medsync.com", password: "password123", role: "Doctor" },
  { email: "doctor2@medsync.com", password: "password123", role: "Doctor" },
  { email: "receptionist@medsync.com", password: "password123", role: "Receptionist" },
  { email: "pharmacist@medsync.com", password: "password123", role: "Pharmacist" },
  { email: "lab@medsync.com", password: "password123", role: "Lab Technician" },
]

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ email: string; success: boolean; message: string }>>([])

  const createDemoUsers = async () => {
    setLoading(true)
    setResults([])

    const newResults: Array<{ email: string; success: boolean; message: string }> = []

    for (const user of demoUsers) {
      try {
        // First, try to sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            emailRedirectTo: undefined, // Disable email confirmation redirect
          },
        })

        if (signUpError) {
          if (
            signUpError.message.includes("already registered") ||
            signUpError.message.includes("already been registered")
          ) {
            // User already exists, try to sign them in to verify
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: user.email,
              password: user.password,
            })

            if (signInError) {
              newResults.push({
                email: user.email,
                success: false,
                message: `User exists but password may be different: ${signInError.message}`,
              })
            } else {
              newResults.push({
                email: user.email,
                success: true,
                message: "User already exists and credentials verified",
              })
              // Sign out immediately after verification
              await supabase.auth.signOut()
            }
          } else {
            newResults.push({
              email: user.email,
              success: false,
              message: signUpError.message,
            })
          }
        } else {
          // Check if user was created successfully
          if (signUpData.user) {
            newResults.push({
              email: user.email,
              success: true,
              message: signUpData.user.email_confirmed_at
                ? "User created and confirmed"
                : "User created (may need email confirmation)",
            })
          } else {
            newResults.push({
              email: user.email,
              success: false,
              message: "User creation failed - no user data returned",
            })
          }
        }
      } catch (err: any) {
        newResults.push({
          email: user.email,
          success: false,
          message: err.message || "Unknown error occurred",
        })
      }

      setResults([...newResults])
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Hospital className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">MedSync HMS Setup</CardTitle>
          <CardDescription>Create demo user accounts for testing the hospital management system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              This will create demo user accounts with the email addresses and passwords listed below. If users already
              exist, they will be skipped.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Demo Users to Create:</h3>
            <div className="grid gap-2">
              {demoUsers.map((user) => (
                <div key={user.email} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{user.email}</span>
                    <span className="text-sm text-gray-500 ml-2">({user.role})</span>
                  </div>
                  <span className="text-sm text-gray-600">password123</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={createDemoUsers} disabled={loading} className="w-full">
            {loading ? "Creating Users..." : "Create Demo Users"}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Results:</h3>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.email}</span>
                    <span className="text-sm text-gray-600">- {result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && results.every((r) => r.success) && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All demo users have been set up successfully! You can now{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  go to the login page
                </a>{" "}
                and sign in with any of the demo accounts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
