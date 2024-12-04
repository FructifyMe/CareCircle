-- First, disable RLS temporarily to reset everything
ALTER TABLE caregivers DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for signup" ON caregivers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON caregivers;
DROP POLICY IF EXISTS "Enable update for users based on auth_id" ON caregivers;

-- Create a single policy that handles all operations
CREATE POLICY "caregivers_policy"
    ON caregivers
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON caregivers TO authenticated;
GRANT ALL ON caregivers TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
