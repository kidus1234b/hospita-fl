// Simple in-memory database for demo purposes
export interface Staff {
  id: string
  email: string
  password: string
  fullName: string
  role: "admin" | "doctor" | "receptionist" | "pharmacist" | "lab_technician"
  department: string | null
  phone: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Patient {
  id: string
  patientId: string
  fullName: string
  dateOfBirth: Date | null
  gender: string | null
  phone: string | null
  email: string | null
  address: string | null
  emergencyContact: string | null
  emergencyPhone: string | null
  bloodGroup: string | null
  allergies: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string | null
  appointmentDate: Date
  appointmentTime: string
  department: string | null
  reason: string | null
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  notes: string | null
  createdById: string | null
  createdAt: Date
  updatedAt: Date
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string | null
  appointmentId: string | null
  diagnosis: string | null
  symptoms: string | null
  treatmentPlan: string | null
  notes: string | null
  visitDate: Date
  createdAt: Date
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string | null
  medicationName: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  instructions: string | null
  status: "pending" | "dispensed" | "cancelled"
  prescribedDate: Date
  dispensedById: string | null
  dispensedDate: Date | null
  createdAt: Date
}

export interface LabTest {
  id: string
  patientId: string
  doctorId: string | null
  testName: string
  testType: string | null
  status: "requested" | "in_progress" | "completed" | "cancelled"
  requestedDate: Date
  completedDate: Date | null
  results: string | null
  reportFileUrl: string | null
  technicianId: string | null
  notes: string | null
  createdAt: Date
}

export interface Inventory {
  id: string
  medicationName: string
  batchNumber: string | null
  quantity: number
  unitPrice: number | null
  expiryDate: Date | null
  supplier: string | null
  minimumStock: number
  createdAt: Date
  updatedAt: Date
}

export interface Billing {
  id: string
  patientId: string
  appointmentId: string | null
  totalAmount: number
  paidAmount: number
  paymentStatus: string
  paymentMethod: string | null
  invoiceNumber: string | null
  createdById: string | null
  createdAt: Date
}

// In-memory data stores
let staffData: Staff[] = []
let patientData: Patient[] = []
let appointmentData: Appointment[] = []
const medicalRecordData: MedicalRecord[] = []
let prescriptionData: Prescription[] = []
let labTestData: LabTest[] = []
let inventoryData: Inventory[] = []
let billingData: Billing[] = []

// Utility function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Database operations
export const db = {
  staff: {
    findMany: () => staffData,
    findUnique: (where: { email?: string; id?: string }) => {
      if (where.email) return staffData.find((s) => s.email === where.email) || null
      if (where.id) return staffData.find((s) => s.id === where.id) || null
      return null
    },
    create: (data: Omit<Staff, "id" | "createdAt" | "updatedAt">) => {
      const newStaff: Staff = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      staffData.push(newStaff)
      return newStaff
    },
    update: (where: { id: string }, data: Partial<Staff>) => {
      const index = staffData.findIndex((s) => s.id === where.id)
      if (index === -1) return null
      staffData[index] = { ...staffData[index], ...data, updatedAt: new Date() }
      return staffData[index]
    },
    delete: (where: { id: string }) => {
      const index = staffData.findIndex((s) => s.id === where.id)
      if (index === -1) return null
      const deleted = staffData[index]
      staffData.splice(index, 1)
      return deleted
    },
  },

  patient: {
    findMany: () => patientData,
    findUnique: (where: { id?: string; patientId?: string }) => {
      if (where.id) return patientData.find((p) => p.id === where.id) || null
      if (where.patientId) return patientData.find((p) => p.patientId === where.patientId) || null
      return null
    },
    create: (data: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
      const newPatient: Patient = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      patientData.push(newPatient)
      return newPatient
    },
    update: (where: { id: string }, data: Partial<Patient>) => {
      const index = patientData.findIndex((p) => p.id === where.id)
      if (index === -1) return null
      patientData[index] = { ...patientData[index], ...data, updatedAt: new Date() }
      return patientData[index]
    },
    delete: (where: { id: string }) => {
      const index = patientData.findIndex((p) => p.id === where.id)
      if (index === -1) return null
      const deleted = patientData[index]
      patientData.splice(index, 1)
      return deleted
    },
  },

  appointment: {
    findMany: () => appointmentData,
    findUnique: (where: { id: string }) => appointmentData.find((a) => a.id === where.id) || null,
    create: (data: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
      const newAppointment: Appointment = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      appointmentData.push(newAppointment)
      return newAppointment
    },
    update: (where: { id: string }, data: Partial<Appointment>) => {
      const index = appointmentData.findIndex((a) => a.id === where.id)
      if (index === -1) return null
      appointmentData[index] = { ...appointmentData[index], ...data, updatedAt: new Date() }
      return appointmentData[index]
    },
    delete: (where: { id: string }) => {
      const index = appointmentData.findIndex((a) => a.id === where.id)
      if (index === -1) return null
      const deleted = appointmentData[index]
      appointmentData.splice(index, 1)
      return deleted
    },
  },

  prescription: {
    findMany: () => prescriptionData,
    findUnique: (where: { id: string }) => prescriptionData.find((p) => p.id === where.id) || null,
    create: (data: Omit<Prescription, "id" | "createdAt">) => {
      const newPrescription: Prescription = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
      }
      prescriptionData.push(newPrescription)
      return newPrescription
    },
  },

  labTest: {
    findMany: () => labTestData,
    findUnique: (where: { id: string }) => labTestData.find((l) => l.id === where.id) || null,
    create: (data: Omit<LabTest, "id" | "createdAt">) => {
      const newLabTest: LabTest = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
      }
      labTestData.push(newLabTest)
      return newLabTest
    },
  },

  inventory: {
    findMany: () => inventoryData,
    findUnique: (where: { id: string }) => inventoryData.find((i) => i.id === where.id) || null,
    create: (data: Omit<Inventory, "id" | "createdAt" | "updatedAt">) => {
      const newInventory: Inventory = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      inventoryData.push(newInventory)
      return newInventory
    },
  },

  billing: {
    findMany: () => billingData,
    findUnique: (where: { id: string }) => billingData.find((b) => b.id === where.id) || null,
    create: (data: Omit<Billing, "id" | "createdAt">) => {
      const newBilling: Billing = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
      }
      billingData.push(newBilling)
      return newBilling
    },
  },
}

// Initialize with demo data
export function initializeDatabase() {
  // Clear existing data
  staffData = []
  patientData = []
  appointmentData = []
  prescriptionData = []
  labTestData = []
  inventoryData = []
  billingData = []

  // Create demo staff
  const staff = [
    {
      email: "admin@medsync.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
      fullName: "System Administrator",
      role: "admin" as const,
      department: "Administration",
      phone: "+1-555-0001",
      isActive: true,
    },
    {
      email: "doctor1@medsync.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
      fullName: "Dr. Sarah Johnson",
      role: "doctor" as const,
      department: "Cardiology",
      phone: "+1-555-0002",
      isActive: true,
    },
    {
      email: "receptionist@medsync.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
      fullName: "Emily Davis",
      role: "receptionist" as const,
      department: "Front Desk",
      phone: "+1-555-0003",
      isActive: true,
    },
    {
      email: "pharmacist@medsync.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
      fullName: "Robert Wilson",
      role: "pharmacist" as const,
      department: "Pharmacy",
      phone: "+1-555-0004",
      isActive: true,
    },
    {
      email: "lab@medsync.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
      fullName: "Lisa Martinez",
      role: "lab_technician" as const,
      department: "Laboratory",
      phone: "+1-555-0005",
      isActive: true,
    },
  ]

  staff.forEach((s) => db.staff.create(s))

  // Create demo patients
  const patients = [
    {
      patientId: "P001",
      fullName: "John Smith",
      dateOfBirth: new Date("1985-03-15"),
      gender: "Male",
      phone: "+1-555-1001",
      email: "john.smith@email.com",
      address: "123 Main St, City, State 12345",
      emergencyContact: "Jane Smith",
      emergencyPhone: "+1-555-1002",
      bloodGroup: "O+",
      allergies: "Penicillin",
    },
    {
      patientId: "P002",
      fullName: "Maria Garcia",
      dateOfBirth: new Date("1992-07-22"),
      gender: "Female",
      phone: "+1-555-1003",
      email: "maria.garcia@email.com",
      address: "456 Oak Ave, City, State 12345",
      emergencyContact: "Carlos Garcia",
      emergencyPhone: "+1-555-1004",
      bloodGroup: "A+",
      allergies: "None known",
    },
    {
      patientId: "P003",
      fullName: "David Brown",
      dateOfBirth: new Date("1978-11-08"),
      gender: "Male",
      phone: "+1-555-1005",
      email: "david.brown@email.com",
      address: "789 Pine St, City, State 12345",
      emergencyContact: "Susan Brown",
      emergencyPhone: "+1-555-1006",
      bloodGroup: "B+",
      allergies: "Shellfish",
    },
  ]

  patients.forEach((p) => db.patient.create(p))

  // Create demo inventory
  const inventory = [
    {
      medicationName: "Aspirin 100mg",
      batchNumber: "ASP001",
      quantity: 500,
      unitPrice: 0.25,
      expiryDate: new Date("2025-12-31"),
      supplier: "PharmaCorp",
      minimumStock: 50,
    },
    {
      medicationName: "Ibuprofen 200mg",
      batchNumber: "IBU001",
      quantity: 300,
      unitPrice: 0.35,
      expiryDate: new Date("2025-08-15"),
      supplier: "MediSupply",
      minimumStock: 30,
    },
    {
      medicationName: "Amoxicillin 500mg",
      batchNumber: "AMX001",
      quantity: 150,
      unitPrice: 1.25,
      expiryDate: new Date("2024-06-30"),
      supplier: "PharmaCorp",
      minimumStock: 25,
    },
  ]

  inventory.forEach((i) => db.inventory.create(i))

  console.log("✅ In-memory database initialized with demo data")
}
