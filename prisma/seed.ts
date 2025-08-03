import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash("password123", 12)

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.upsert({
      where: { email: "admin@medsync.com" },
      update: {},
      create: {
        email: "admin@medsync.com",
        password: hashedPassword,
        fullName: "Dr. Sarah Johnson",
        role: "admin",
        department: "Administration",
        phone: "+1-555-0101",
      },
    }),
    prisma.staff.upsert({
      where: { email: "doctor1@medsync.com" },
      update: {},
      create: {
        email: "doctor1@medsync.com",
        password: hashedPassword,
        fullName: "Dr. Michael Chen",
        role: "doctor",
        department: "Cardiology",
        phone: "+1-555-0102",
      },
    }),
    prisma.staff.upsert({
      where: { email: "doctor2@medsync.com" },
      update: {},
      create: {
        email: "doctor2@medsync.com",
        password: hashedPassword,
        fullName: "Dr. Emily Rodriguez",
        role: "doctor",
        department: "Pediatrics",
        phone: "+1-555-0103",
      },
    }),
    prisma.staff.upsert({
      where: { email: "receptionist@medsync.com" },
      update: {},
      create: {
        email: "receptionist@medsync.com",
        password: hashedPassword,
        fullName: "Lisa Thompson",
        role: "receptionist",
        department: "Front Desk",
        phone: "+1-555-0104",
      },
    }),
    prisma.staff.upsert({
      where: { email: "pharmacist@medsync.com" },
      update: {},
      create: {
        email: "pharmacist@medsync.com",
        password: hashedPassword,
        fullName: "James Wilson",
        role: "pharmacist",
        department: "Pharmacy",
        phone: "+1-555-0105",
      },
    }),
    prisma.staff.upsert({
      where: { email: "lab@medsync.com" },
      update: {},
      create: {
        email: "lab@medsync.com",
        password: hashedPassword,
        fullName: "Maria Garcia",
        role: "lab_technician",
        department: "Laboratory",
        phone: "+1-555-0106",
      },
    }),
  ])

  console.log("✅ Staff created:", staff.length)

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
        bloodGroup: "O+",
      },
    }),
    prisma.patient.upsert({
      where: { patientId: "P002" },
      update: {},
      create: {
        patientId: "P002",
        fullName: "Emma Davis",
        dateOfBirth: new Date("1992-07-22"),
        gender: "Female",
        phone: "+1-555-1002",
        email: "emma.davis@email.com",
        address: "456 Oak Ave, City, State 12345",
        bloodGroup: "A+",
      },
    }),
    prisma.patient.upsert({
      where: { patientId: "P003" },
      update: {},
      create: {
        patientId: "P003",
        fullName: "Robert Johnson",
        dateOfBirth: new Date("1978-11-08"),
        gender: "Male",
        phone: "+1-555-1003",
        email: "robert.j@email.com",
        address: "789 Pine Rd, City, State 12345",
        bloodGroup: "B+",
      },
    }),
    prisma.patient.upsert({
      where: { patientId: "P004" },
      update: {},
      create: {
        patientId: "P004",
        fullName: "Sophie Wilson",
        dateOfBirth: new Date("2010-05-12"),
        gender: "Female",
        phone: "+1-555-1004",
        email: "sophie.parent@email.com",
        address: "321 Elm St, City, State 12345",
        bloodGroup: "AB+",
      },
    }),
  ])

  console.log("✅ Patients created:", patients.length)

  // Create sample appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: staff[1].id, // Dr. Michael Chen
        appointmentDate: tomorrow,
        appointmentTime: "09:00",
        department: "Cardiology",
        reason: "Chest pain consultation",
        createdById: staff[3].id, // Receptionist
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: staff[2].id, // Dr. Emily Rodriguez
        appointmentDate: dayAfterTomorrow,
        appointmentTime: "10:30",
        department: "Pediatrics",
        reason: "Regular checkup",
        createdById: staff[3].id, // Receptionist
      },
    }),
  ])

  console.log("✅ Appointments created:", appointments.length)

  // Create sample inventory
  const inventory = await Promise.all([
    prisma.inventory.create({
      data: {
        medicationName: "Aspirin 100mg",
        batchNumber: "ASP001",
        quantity: 500,
        unitPrice: 0.5,
        expiryDate: new Date("2025-12-31"),
        supplier: "PharmaCorp",
        minimumStock: 50,
      },
    }),
    prisma.inventory.create({
      data: {
        medicationName: "Amoxicillin 500mg",
        batchNumber: "AMX001",
        quantity: 200,
        unitPrice: 2.5,
        expiryDate: new Date("2025-06-30"),
        supplier: "MediSupply",
        minimumStock: 25,
      },
    }),
    prisma.inventory.create({
      data: {
        medicationName: "Lisinopril 10mg",
        batchNumber: "LIS001",
        quantity: 150,
        unitPrice: 1.75,
        expiryDate: new Date("2025-09-15"),
        supplier: "PharmaCorp",
        minimumStock: 30,
      },
    }),
    prisma.inventory.create({
      data: {
        medicationName: "Metformin 500mg",
        batchNumber: "MET001",
        quantity: 300,
        unitPrice: 1.25,
        expiryDate: new Date("2025-11-20"),
        supplier: "HealthMeds",
        minimumStock: 40,
      },
    }),
  ])

  console.log("✅ Inventory created:", inventory.length)

  console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
