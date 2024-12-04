-- Drop existing policies for caregivers table
DROP POLICY IF EXISTS "Caregivers can view their own profile" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update their own profile" ON caregivers;

-- Create new policies for caregivers table
CREATE POLICY "Enable insert for authentication users only" 
    ON caregivers FOR INSERT 
    WITH CHECK (auth.uid()::text = auth_id);

CREATE POLICY "Enable read access for users based on auth_id" 
    ON caregivers FOR SELECT 
    USING (auth.uid()::text = auth_id);

CREATE POLICY "Enable update for users based on auth_id" 
    ON caregivers FOR UPDATE 
    USING (auth.uid()::text = auth_id)
    WITH CHECK (auth.uid()::text = auth_id);

-- Add a policy to allow authenticated users to see other caregivers
CREATE POLICY "Allow authenticated users to see all caregivers"
    ON caregivers FOR SELECT
    USING (auth.role() = 'authenticated');

-- Make sure RLS is enabled
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
