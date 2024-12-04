-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON caregivers TO authenticated;

-- Reset RLS policies for caregivers
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON caregivers;
DROP POLICY IF EXISTS "Enable read access for users based on auth_id" ON caregivers;
DROP POLICY IF EXISTS "Enable update for users based on auth_id" ON caregivers;
DROP POLICY IF EXISTS "Allow authenticated users to see all caregivers" ON caregivers;

-- Create simpler policies first
CREATE POLICY "Enable all operations for authenticated users"
    ON caregivers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Make sure RLS is enabled
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
