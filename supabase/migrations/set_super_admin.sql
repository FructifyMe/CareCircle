-- Set your account as super_admin
UPDATE caregivers
SET role = 'super_admin'
WHERE email = auth.jwt() ->> 'email';

-- Verify the update
SELECT id, email, role FROM caregivers WHERE role = 'super_admin';
