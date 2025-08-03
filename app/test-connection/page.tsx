"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "error">("testing")
  const [error, setError] = useState("")
  const [staffCount, setStaffCount] = useState<number | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionStatus("testing")
    setError("")

    try {
      // Test basic connection
      const { data, error: connectionError } = await supabase.from("staff").select("id", { count: "exact" })

      if (connectionError) {
        throw connectionError
      }

      setStaffCount(data?.length || 0)
      setConnectionStatus("connected")
    } catch (err: any) {
      setConnectionStatus("error")
      setError(err.message || "Connection failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>Testing database connection and setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Connection Status:</span>
            <Badge
              variant={
                connectionStatus === "connected"
                  ? "default"
                  : connectionStatus === "error"
                    ? "destructive"
                    : "secondary"
              }
            >
              {connectionStatus === "testing" && "Testing..."}
              {connectionStatus === "connected" && "Connected ✅"}
              {connectionStatus === "error" && "Error ❌"}
            </Badge>
          </div>

          {staffCount !== null && (
            <div className="flex items-center justify-between">
              <span>Staff Records:</span>
              <Badge variant="outline">{staffCount} found</Badge>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={testConnection} className="w-full bg-transparent" variant="outline">
              Test Connection Again
            </Button>
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Go to Login
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Environment Check:</strong>
            </p>
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
            <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
