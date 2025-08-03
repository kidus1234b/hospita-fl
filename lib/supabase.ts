import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type UserRole = "admin" | "doctor" | "receptionist" | "pharmacist" | "lab_technician"

export interface Staff {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  patient_id: string
  full_name: string
  date_of_birth: string | null
  gender: string | null
  phone: string | null
  email: string | null
  address: string | null
  emergency_contact: string | null
  emergency_phone: string | null
  blood_group: string | null
  allergies: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string | null
  appointment_date: string
  appointment_time: string
  department: string | null
  reason: string | null
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  patients?: Patient
  staff?: Staff
}

export interface Prescription {
  id: string
  patient_id: string
  doctor_id: string | null
  medication_name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  instructions: string | null
  status: "pending" | "dispensed" | "cancelled"
  prescribed_date: string
  dispensed_by: string | null
  dispensed_date: string | null
  created_at: string
  patients?: Patient
  staff?: Staff
}

export interface LabTest {
  id: string
  patient_id: string
  doctor_id: string | null
  test_name: string
  test_type: string | null
  status: "requested" | "in_progress" | "completed" | "cancelled"
  requested_date: string
  completed_date: string | null
  results: string | null
  report_file_url: string | null
  technician_id: string | null
  notes: string | null
  created_at: string
  patients?: Patient
  staff?: Staff
}

export interface InventoryItem {
  id: string
  medication_name: string
  batch_number: string | null
  quantity: number
  unit_price: number | null
  expiry_date: string | null
  supplier: string | null
  minimum_stock: number
  created_at: string
  updated_at: string
}
