-- Insert sample staff
INSERT INTO staff (id, email, full_name, role, department, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@medsync.com', 'Dr. Sarah Johnson', 'admin', 'Administration', '+1-555-0101'),
('22222222-2222-2222-2222-222222222222', 'doctor1@medsync.com', 'Dr. Michael Chen', 'doctor', 'Cardiology', '+1-555-0102'),
('33333333-3333-3333-3333-333333333333', 'doctor2@medsync.com', 'Dr. Emily Rodriguez', 'doctor', 'Pediatrics', '+1-555-0103'),
('44444444-4444-4444-4444-444444444444', 'receptionist@medsync.com', 'Lisa Thompson', 'receptionist', 'Front Desk', '+1-555-0104'),
('55555555-5555-5555-5555-555555555555', 'pharmacist@medsync.com', 'James Wilson', 'pharmacist', 'Pharmacy', '+1-555-0105'),
('66666666-6666-6666-6666-666666666666', 'lab@medsync.com', 'Maria Garcia', 'lab_technician', 'Laboratory', '+1-555-0106');

-- Insert sample patients
INSERT INTO patients (patient_id, full_name, date_of_birth, gender, phone, email, address, blood_group) VALUES
('P001', 'John Smith', '1985-03-15', 'Male', '+1-555-1001', 'john.smith@email.com', '123 Main St, City, State 12345', 'O+'),
('P002', 'Emma Davis', '1992-07-22', 'Female', '+1-555-1002', 'emma.davis@email.com', '456 Oak Ave, City, State 12345', 'A+'),
('P003', 'Robert Johnson', '1978-11-08', 'Male', '+1-555-1003', 'robert.j@email.com', '789 Pine Rd, City, State 12345', 'B+'),
('P004', 'Sophie Wilson', '2010-05-12', 'Female', '+1-555-1004', 'sophie.parent@email.com', '321 Elm St, City, State 12345', 'AB+');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, department, reason, created_by) VALUES
((SELECT id FROM patients WHERE patient_id = 'P001'), '22222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '1 day', '09:00', 'Cardiology', 'Chest pain consultation', '44444444-4444-4444-4444-444444444444'),
((SELECT id FROM patients WHERE patient_id = 'P002'), '33333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '2 days', '10:30', 'Pediatrics', 'Regular checkup', '44444444-4444-4444-4444-444444444444'),
((SELECT id FROM patients WHERE patient_id = 'P003'), '22222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '3 days', '14:00', 'Cardiology', 'Follow-up visit', '44444444-4444-4444-4444-444444444444');

-- Insert sample inventory
INSERT INTO inventory (medication_name, batch_number, quantity, unit_price, expiry_date, supplier, minimum_stock) VALUES
('Aspirin 100mg', 'ASP001', 500, 0.50, '2025-12-31', 'PharmaCorp', 50),
('Amoxicillin 500mg', 'AMX001', 200, 2.50, '2025-06-30', 'MediSupply', 25),
('Lisinopril 10mg', 'LIS001', 150, 1.75, '2025-09-15', 'PharmaCorp', 30),
('Metformin 500mg', 'MET001', 300, 1.25, '2025-11-20', 'HealthMeds', 40);
