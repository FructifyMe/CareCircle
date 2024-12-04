-- First, drop all existing policies
DROP POLICY IF EXISTS "Super admins have full access" ON caregivers;
DROP POLICY IF EXISTS "Admins can view all caregivers" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view their own record" ON caregivers;
DROP POLICY IF EXISTS "Users can update their own basic info" ON caregivers;

-- Create a temporary super admin view to avoid recursion
CREATE OR REPLACE VIEW super_admin_emails AS
SELECT email FROM caregivers WHERE role = 'super_admin';

-- Create new policies without recursion
CREATE POLICY "Enable read for all authenticated users" ON caregivers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admins have full access" ON caregivers
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'mikefarley@msn.com'  -- Hardcode your email temporarily
    );

CREATE POLICY "Users can update their own basic info" ON caregivers
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = email
    );

-- Verify your super admin status
SELECT name, email, role, patient_ids 
FROM caregivers 
WHERE email = 'mikefarley@msn.com';
