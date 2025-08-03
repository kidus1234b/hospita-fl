-- Note: This script needs to be run in the Supabase SQL Editor with service role permissions
-- or you can create these users through the Supabase Dashboard Auth section

-- Since we can't directly insert into auth.users via SQL in most cases,
-- you'll need to create these users through the Supabase Dashboard or use the Admin API

-- Go to your Supabase Dashboard > Authentication > Users
-- Click "Add user" and create the following users:

-- 1. Admin User
--    Email: admin@medsync.com
--    Password: password123
--    Email Confirmed: Yes

-- 2. Doctor User  
--    Email: doctor1@medsync.com
--    Password: password123
--    Email Confirmed: Yes

-- 3. Doctor User 2
--    Email: doctor2@medsync.com  
--    Password: password123
--    Email Confirmed: Yes

-- 4. Receptionist User
--    Email: receptionist@medsync.com
--    Password: password123
--    Email Confirmed: Yes

-- 5. Pharmacist User
--    Email: pharmacist@medsync.com
--    Password: password123
--    Email Confirmed: Yes

-- 6. Lab Technician User
--    Email: lab@medsync.com
--    Password: password123
--    Email Confirmed: Yes

-- Alternative: If you have service role access, you can use this function:
-- But this requires service role key and should be done server-side

-- CREATE OR REPLACE FUNCTION create_demo_users()
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   -- This would require service role permissions
--   -- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
--   -- VALUES (...);
-- END;
-- $$;
