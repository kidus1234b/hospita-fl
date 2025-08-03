import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db, type Staff, initializeDatabase } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export type UserRole = "admin" | "doctor" | "receptionist" | "pharmacist" | "lab_technician"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  department: string | null
}

// Initialize database on first import
initializeDatabase()

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
  const staff = db.staff.findUnique({ email })

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

  return db.staff.findUnique({ id: user.id })
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}
