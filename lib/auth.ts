import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./prisma"
import type { Staff, UserRole } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  department: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const staff = await prisma.staff.findUnique({
    where: { email },
  })

  if (!staff || !staff.isActive) {
    throw new Error("Invalid login credentials")
  }

  const isValidPassword = await verifyPassword(password, staff.password)
  if (!isValidPassword) {
    throw new Error("Invalid login credentials")
  }

  const user: AuthUser = {
    id: staff.id,
    email: staff.email,
    fullName: staff.fullName,
    role: staff.role,
    department: staff.department,
  }

  const token = generateToken(user)

  return { user, token }
}

export async function getCurrentStaff(token: string): Promise<Staff | null> {
  const user = verifyToken(token)
  if (!user) return null

  return prisma.staff.findUnique({
    where: { id: user.id },
  })
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}
