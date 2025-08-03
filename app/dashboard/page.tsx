"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentStaff } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { Staff } from "@/lib/supabase"
import { Users, Calendar, FileText, Pill, TestTube, CreditCard, TrendingUp, Clock } from "lucide-react"

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingPrescriptions: number
  pendingLabTests: number
  totalRevenue: number
  activeStaff: number
}

export default function DashboardPage() {
  const [staff, setStaff] = useState<Staff | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
    pendingLabTests: 0,
    totalRevenue: 0,
    activeStaff: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentStaff = await getCurrentStaff()
        setStaff(currentStaff)

        // Load dashboard statistics
        const [patientsResult, appointmentsResult, prescriptionsResult, labTestsResult, billingResult, staffResult] =
          await Promise.all([
            supabase.from("patients").select("id", { count: "exact" }),
            supabase
              .from("appointments")
              .select("id", { count: "exact" })
              .eq("appointment_date", new Date().toISOString().split("T")[0]),
            supabase.from("prescriptions").select("id", { count: "exact" }).eq("status", "pending"),
            supabase.from("lab_tests").select("id", { count: "exact" }).in("status", ["requested", "in_progress"]),
            supabase.from("billing").select("total_amount").eq("payment_status", "paid"),
            supabase.from("staff").select("id", { count: "exact" }).eq("is_active", true),
          ])

        const totalRevenue = billingResult.data?.reduce((sum, bill) => sum + (bill.total_amount || 0), 0) || 0

        setStats({
          totalPatients: patientsResult.count || 0,
          todayAppointments: appointmentsResult.count || 0,
          pendingPrescriptions: prescriptionsResult.count || 0,
          pendingLabTests: labTestsResult.count || 0,
          totalRevenue,
          activeStaff: staffResult.count || 0,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    return `${greeting}, ${staff?.full_name || "User"}!`
  }

  const getRoleSpecificCards = () => {
    if (!staff) return []

    const baseCards = [
      {
        title: "Total Patients",
        value: stats.totalPatients.toString(),
        description: "Registered patients",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
    ]

    switch (staff.role) {
      case "admin":
        return [
          ...baseCards,
          {
            title: "Active Staff",
            value: stats.activeStaff.toString(),
            description: "Currently active staff members",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
          {
            title: "Today's Appointments",
            value: stats.todayAppointments.toString(),
            description: "Scheduled for today",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            description: "Total collected revenue",
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
          },
        ]

      case "doctor":
        return [
          ...baseCards,
          {
            title: "Today's Appointments",
            value: stats.todayAppointments.toString(),
            description: "Your appointments today",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            title: "Pending Lab Tests",
            value: stats.pendingLabTests.toString(),
            description: "Tests awaiting results",
            icon: TestTube,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
          },
        ]

      case "receptionist":
        return [
          ...baseCards,
          {
            title: "Today's Appointments",
            value: stats.todayAppointments.toString(),
            description: "Scheduled appointments",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            title: "Revenue Today",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            description: "Today's collections",
            icon: CreditCard,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
          },
        ]

      case "pharmacist":
        return [
          {
            title: "Pending Prescriptions",
            value: stats.pendingPrescriptions.toString(),
            description: "Awaiting dispensing",
            icon: Pill,
            color: "text-red-600",
            bgColor: "bg-red-100",
          },
          {
            title: "Low Stock Items",
            value: "5",
            description: "Items below minimum stock",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
          },
        ]

      case "lab_technician":
        return [
          {
            title: "Pending Tests",
            value: stats.pendingLabTests.toString(),
            description: "Tests to be processed",
            icon: TestTube,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
          },
          {
            title: "Completed Today",
            value: "12",
            description: "Tests completed today",
            icon: FileText,
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
        ]

      default:
        return baseCards
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 capitalize">
          {staff?.role} - {staff?.department}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getRoleSpecificCards().map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {staff?.role === "receptionist" && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Register New Patient</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Schedule Appointment</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Process Payment</button>
                </>
              )}
              {staff?.role === "doctor" && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">View Today's Appointments</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Create Prescription</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Order Lab Test</button>
                </>
              )}
              {staff?.role === "pharmacist" && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Process Prescriptions</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Update Inventory</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Check Stock Levels</button>
                </>
              )}
              {staff?.role === "lab_technician" && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Process Test Requests</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Upload Test Results</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">View Pending Tests</button>
                </>
              )}
              {staff?.role === "admin" && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">Manage Staff</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">View Reports</button>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-100">System Settings</button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New patient registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment scheduled</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lab test completed</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Prescription dispensed</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
