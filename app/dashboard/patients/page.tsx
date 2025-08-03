"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, type Patient, type Staff } from "@/lib/database"
import { Plus, Search, Edit, Eye, Phone, Mail, Calendar, Users } from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state for new patient
  const [newPatient, setNewPatient] = useState({
    patientId: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodGroup: "",
    allergies: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user from cookie
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const { user } = await response.json()
          setStaff(user)
        }

        // Load patients from in-memory database
        const allPatients = db.patient.findMany()
        setPatients(allPatients)
      } catch (error) {
        console.error("Error loading patients:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generatePatientId = () => {
    const existingIds = patients.map((p) => p.patientId)
    let nextNumber = 1
    let newId = `P${String(nextNumber).padStart(3, "0")}`

    while (existingIds.includes(newId)) {
      nextNumber++
      newId = `P${String(nextNumber).padStart(3, "0")}`
    }

    return newId
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const patientId = generatePatientId()
      const patientData = {
        ...newPatient,
        patientId,
        dateOfBirth: newPatient.dateOfBirth ? new Date(newPatient.dateOfBirth) : null,
      }

      const createdPatient = db.patient.create(patientData)
      setPatients([createdPatient, ...patients])

      setNewPatient({
        patientId: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        bloodGroup: "",
        allergies: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding patient:", error)
    }
  }

  const canManagePatients = staff?.role === "admin" || staff?.role === "receptionist"

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        {canManagePatients && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Enter patient information to create a new record.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={newPatient.fullName}
                      onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newPatient.dateOfBirth}
                      onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newPatient.gender}
                      onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={newPatient.bloodGroup}
                      onValueChange={(value) => setNewPatient({ ...newPatient, bloodGroup: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={newPatient.emergencyContact}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={newPatient.emergencyPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    placeholder="List any known allergies..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Patient</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients by name, ID, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{patient.fullName}</h3>
                    <Badge variant="outline">{patient.patientId}</Badge>
                    {patient.bloodGroup && <Badge variant="secondary">{patient.bloodGroup}</Badge>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {patient.dateOfBirth
                          ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years old`
                          : "Age not specified"}
                      </span>
                    </div>
                    {patient.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    {patient.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </div>

                  {patient.allergies && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-red-600">Allergies: </span>
                      <span className="text-sm text-red-600">{patient.allergies}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(patient)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canManagePatients && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>Complete information for {selectedPatient?.fullName}</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Patient ID</Label>
                  <p>{selectedPatient.patientId}</p>
                </div>
                <div>
                  <Label className="font-semibold">Full Name</Label>
                  <p>{selectedPatient.fullName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Date of Birth</Label>
                  <p>{selectedPatient.dateOfBirth?.toLocaleDateString() || "Not specified"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Gender</Label>
                  <p>{selectedPatient.gender || "Not specified"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Blood Group</Label>
                  <p>{selectedPatient.bloodGroup || "Not specified"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Phone</Label>
                  <p>{selectedPatient.phone || "Not provided"}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Email</Label>
                <p>{selectedPatient.email || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-semibold">Address</Label>
                <p>{selectedPatient.address || "Not provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Emergency Contact</Label>
                  <p>{selectedPatient.emergencyContact || "Not provided"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Emergency Phone</Label>
                  <p>{selectedPatient.emergencyPhone || "Not provided"}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Allergies</Label>
                <p>{selectedPatient.allergies || "None reported"}</p>
              </div>
              <div>
                <Label className="font-semibold">Registered</Label>
                <p>{selectedPatient.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredPatients.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No patients found</h3>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first patient"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
