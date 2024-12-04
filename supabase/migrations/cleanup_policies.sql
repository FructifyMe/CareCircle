-- Drop ALL existing policies
DROP POLICY IF EXISTS "caregivers_policy" ON caregivers;
DROP POLICY IF EXISTS "Super admin full access and others read" ON caregivers;
DROP POLICY IF EXISTS "Admins can view all caregivers" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view their own record" ON caregivers;
DROP POLICY IF EXISTS "Users can update their own basic info" ON caregivers;
DROP POLICY IF EXISTS "Enable read for all authenticated users" ON caregivers;

-- Create a single, clear policy
CREATE POLICY "super_admin_and_auth_policy" ON caregivers
FOR ALL
USING (
    CASE 
        WHEN auth.jwt() ->> 'email' = 'mikefarley@msn.com' THEN true  -- Super admin can do anything
        WHEN auth.role() = 'authenticated' THEN true  -- Other authenticated users can read
        ELSE false
    END
)
WITH CHECK (
    auth.jwt() ->> 'email' = 'mikefarley@msn.com'  -- Only super admin can modify
);

-- Verify policies
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'caregivers';
