-- First, drop all existing policies
DROP POLICY IF EXISTS "Super admins have full access" ON caregivers;
DROP POLICY IF EXISTS "Admins can view all caregivers" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view their own record" ON caregivers;
DROP POLICY IF EXISTS "Users can update their own basic info" ON caregivers;
DROP POLICY IF EXISTS "Enable read for all authenticated users" ON caregivers;

-- Create a simple policy that gives super_admin full access and others read-only
CREATE POLICY "Super admin full access and others read" ON caregivers AS PERMISSIVE
FOR ALL
USING (
    (role = 'super_admin' AND email = 'mikefarley@msn.com')  -- Super admin can do anything
    OR
    (auth.role() = 'authenticated')  -- Others can read
)
WITH CHECK (
    (role = 'super_admin' AND email = 'mikefarley@msn.com')  -- Only super admin can modify
);

-- Verify the policy
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'caregivers';
