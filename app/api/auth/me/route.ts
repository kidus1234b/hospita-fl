import { type NextRequest, NextResponse } from "next/server"
import { getCurrentStaff } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const staff = await getCurrentStaff(token)

    if (!staff) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = staff

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get user" }, { status: 500 })
  }
}
