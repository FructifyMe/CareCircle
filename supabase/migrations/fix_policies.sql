-- First, drop all existing policies on the caregivers table
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON caregivers;
DROP POLICY IF EXISTS "Enable read access for users based on auth_id" ON caregivers;
DROP POLICY IF EXISTS "Enable update for users based on auth_id" ON caregivers;
DROP POLICY IF EXISTS "Allow authenticated users to see all caregivers" ON caregivers;

-- Create a policy that allows insertion during signup
CREATE POLICY "Enable insert for signup"
    ON caregivers FOR INSERT
    WITH CHECK (true);  -- This allows initial insertion for new users

-- Create policy for reading own profile and other caregivers
CREATE POLICY "Enable read access for authenticated users"
    ON caregivers FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create policy for updating own profile
CREATE POLICY "Enable update for users based on auth_id"
    ON caregivers FOR UPDATE
    USING (auth.uid()::text = auth_id);

-- Make sure RLS is enabled
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
