import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.upsert({
      where: { email: "admin@medsync.com" },
      update: {},
      create: {
        email: "admin@medsync.com",
        password: hashedPassword,
        fullName: "System Administrator",
        role: UserRole.admin,
        department: "Administration",
        phone: "+1-555-0001",
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: "doctor1@medsync.com" },
      update: {},
      create: {
        email: "doctor1@medsync.com",
        password: hashedPassword,
        fullName: "Dr. Sarah Johnson",
        role: UserRole.doctor,
        department: "Cardiology",
        phone: "+1-555-0002",
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: "doctor2@medsync.com" },
      update: {},
      create: {
        email: "doctor2@medsync.com",
        password: hashedPassword,
        fullName: "Dr. Michael Chen",
        role: UserRole.doctor,
        department: "Neurology",
        phone: "+1-555-0003",
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: "receptionist@medsync.com" },
      update: {},
      create: {
        email: "receptionist@medsync.com",
        password: hashedPassword,
        fullName: "Emily Davis",
        role: UserRole.receptionist,
        department: "Front Desk",
        phone: "+1-555-0004",
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: "pharmacist@medsync.com" },
      update: {},
      create: {
        email: "pharmacist@medsync.com",
        password: hashedPassword,
        fullName: "Robert Wilson",
        role: UserRole.pharmacist,
        department: "Pharmacy",
        phone: "+1-555-0005",
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: "lab@medsync.com" },
      update: {},
      create: {
        email: "lab@medsync.com",
        password: hashedPassword,
        fullName: "Lisa Martinez",
        role: UserRole.lab_technician,
        department: "Laboratory",
        phone: "+1-555-0006",
        isActive: true,
      },
    }),
  ])

  console.log("👥 Created staff members:", staff.length)

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { patientId: "P001" },
      update: {},
      create: {
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
    }),
    prisma.patient.upsert({
      where: { patientId: "P002" },
      update: {},
      create: {
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
    }),
    prisma.patient.upsert({
      where: { patientId: "P003" },
      update: {},
      create: {
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
    }),
  ])

  console.log("🏥 Created patients:", patients.length)

  // Create sample appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: staff[1].id, // Dr. Sarah Johnson
        appointmentDate: new Date("2024-01-15"),
        appointmentTime: "09:00",
        department: "Cardiology",
        reason: "Regular checkup",
        status: "scheduled",
        createdById: staff[3].id, // Receptionist
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: staff[2].id, // Dr. Michael Chen
        appointmentDate: new Date("2024-01-16"),
        appointmentTime: "14:30",
        department: "Neurology",
        reason: "Headache consultation",
        status: "scheduled",
        createdById: staff[3].id, // Receptionist
      },
    }),
  ])

  console.log("📅 Created appointments:", appointments.length)

  // Create sample inventory
  const inventory = await Promise.all([
    prisma.inventory.create({
      data: {
        medicationName: "Aspirin 100mg",
        batchNumber: "ASP001",
        quantity: 500,
        unitPrice: 0.25,
        expiryDate: new Date("2025-12-31"),
        supplier: "PharmaCorp",
        minimumStock: 50,
      },
    }),
    prisma.inventory.create({
      data: {
        medicationName: "Ibuprofen 200mg",
        batchNumber: "IBU001",
        quantity: 300,
        unitPrice: 0.35,
        expiryDate: new Date("2025-08-15"),
        supplier: "MediSupply",
        minimumStock: 30,
      },
    }),
    prisma.inventory.create({
      data: {
        medicationName: "Amoxicillin 500mg",
        batchNumber: "AMX001",
        quantity: 150,
        unitPrice: 1.25,
        expiryDate: new Date("2024-06-30"),
        supplier: "PharmaCorp",
        minimumStock: 25,
      },
    }),
  ])

  console.log("💊 Created inventory items:", inventory.length)

  console.log("✅ Database seed completed successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
