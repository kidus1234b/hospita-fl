-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'receptionist', 'pharmacist', 'lab_technician');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE prescription_status AS ENUM ('pending', 'dispensed', 'cancelled');
CREATE TYPE lab_test_status AS ENUM ('requested', 'in_progress', 'completed', 'cancelled');

-- Staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    blood_group VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    department VARCHAR(100),
    reason TEXT,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    symptoms TEXT,
    treatment_plan TEXT,
    notes TEXT,
    visit_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    status prescription_status DEFAULT 'pending',
    prescribed_date DATE DEFAULT CURRENT_DATE,
    dispensed_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    dispensed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab tests table
CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100),
    status lab_test_status DEFAULT 'requested',
    requested_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    results TEXT,
    report_file_url TEXT,
    technician_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table (for pharmacy)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2),
    expiry_date DATE,
    supplier VARCHAR(255),
    minimum_stock INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing table
CREATE TABLE billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    invoice_number VARCHAR(50) UNIQUE,
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Staff policies
CREATE POLICY "Staff can view all staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Only admins can insert staff" ON staff FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update staff" ON staff FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role = 'admin')
);

-- Patients policies
CREATE POLICY "Staff can view all patients" ON patients FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid())
);
CREATE POLICY "Receptionists and admins can insert patients" ON patients FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);
CREATE POLICY "Receptionists and admins can update patients" ON patients FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);

-- Appointments policies
CREATE POLICY "Staff can view appointments" ON appointments FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid())
);
CREATE POLICY "Receptionists and admins can manage appointments" ON appointments FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);

-- Medical records policies
CREATE POLICY "Doctors can view and manage medical records" ON medical_records FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);

-- Prescriptions policies
CREATE POLICY "Doctors and pharmacists can view prescriptions" ON prescriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('doctor', 'pharmacist', 'admin'))
);
CREATE POLICY "Doctors can create prescriptions" ON prescriptions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Pharmacists can update prescriptions" ON prescriptions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('pharmacist', 'admin'))
);

-- Lab tests policies
CREATE POLICY "Doctors and lab technicians can view lab tests" ON lab_tests FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('doctor', 'lab_technician', 'admin'))
);
CREATE POLICY "Doctors can create lab tests" ON lab_tests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Lab technicians can update lab tests" ON lab_tests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('lab_technician', 'admin'))
);

-- Inventory policies
CREATE POLICY "Pharmacists can manage inventory" ON inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('pharmacist', 'admin'))
);

-- Billing policies
CREATE POLICY "Receptionists and admins can manage billing" ON billing FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);
