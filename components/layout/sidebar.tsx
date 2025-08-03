"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UserRole } from "@prisma/client"
import {
  Hospital,
  Users,
  Calendar,
  FileText,
  Pill,
  TestTube,
  CreditCard,
  LogOut,
  UserCheck,
  Package,
} from "lucide-react"

interface SidebarProps {
  className?: string
  user: any
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Hospital,
    roles: ["admin", "doctor", "receptionist", "pharmacist", "lab_technician"],
  },
  {
    title: "Staff Management",
    href: "/dashboard/staff",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: UserCheck,
    roles: ["admin", "doctor", "receptionist"],
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: ["admin", "doctor", "receptionist"],
  },
  {
    title: "Medical Records",
    href: "/dashboard/medical-records",
    icon: FileText,
    roles: ["admin", "doctor"],
  },
  {
    title: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: Pill,
    roles: ["admin", "doctor", "pharmacist"],
  },
  {
    title: "Lab Tests",
    href: "/dashboard/lab-tests",
    icon: TestTube,
    roles: ["admin", "doctor", "lab_technician"],
  },
  {
    title: "Pharmacy",
    href: "/dashboard/pharmacy",
    icon: Package,
    roles: ["admin", "pharmacist"],
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    roles: ["admin", "receptionist"],
  },
]

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNavItems = navItems.filter((item) => user?.role && item.roles.includes(user.role))

  return (
    <div className={cn("flex h-full w-64 flex-col bg-white border-r", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Hospital className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">MedSync HMS</span>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="mb-4 px-3">
          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role?.replace("_", " ")}</p>
          <p className="text-xs text-gray-500">{user?.department}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {loading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
