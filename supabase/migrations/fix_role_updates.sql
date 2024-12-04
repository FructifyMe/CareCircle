-- Enable RLS
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;

-- Update caregivers table role constraint
ALTER TABLE caregivers DROP CONSTRAINT IF EXISTS caregivers_role_check;
ALTER TABLE caregivers ADD CONSTRAINT caregivers_role_check 
    CHECK (role IN ('super_admin', 'admin', 'caregiver'));

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Caregivers can view their own record" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update their own record" ON caregivers;
DROP POLICY IF EXISTS "Admins can view all caregivers" ON caregivers;
DROP POLICY IF EXISTS "Admins can create caregivers" ON caregivers;
DROP POLICY IF EXISTS "Admins can update caregivers" ON caregivers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON patients;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON care_shifts;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON care_tasks;

-- Create new policies for caregivers table
CREATE POLICY "Super admins have full access" ON caregivers
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role = 'super_admin'
        )
    );

CREATE POLICY "Admins can view all caregivers" ON caregivers
    FOR SELECT USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Caregivers can view their own record" ON caregivers
    FOR SELECT USING (
        auth.jwt() ->> 'email' = email
    );

CREATE POLICY "Users can update their own basic info" ON caregivers
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = email
    );

-- Policies for patients table
CREATE POLICY "Super admins have full access to patients" ON patients
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role = 'super_admin'
        )
    );

CREATE POLICY "Users can view assigned patients" ON patients
    FOR SELECT USING (
        id IN (
            SELECT UNNEST(patient_ids) 
            FROM caregivers 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Policies for care_shifts table
CREATE POLICY "Super admins and admins have full access to shifts" ON care_shifts
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Caregivers can view and select available shifts" ON care_shifts
    FOR SELECT USING (true);

CREATE POLICY "Caregivers can take available shifts" ON care_shifts
    FOR UPDATE USING (
        caregiver_id IS NULL
        AND auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role = 'caregiver'
        )
    );

-- Policies for care_tasks table
CREATE POLICY "Super admins and admins have full access to tasks" ON care_tasks
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM caregivers WHERE role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Caregivers can view and update assigned tasks" ON care_tasks
    FOR SELECT USING (
        patient_id IN (
            SELECT UNNEST(patient_ids) 
            FROM caregivers 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Caregivers can update task status" ON care_tasks
    FOR UPDATE USING (
        patient_id IN (
            SELECT UNNEST(patient_ids) 
            FROM caregivers 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Set your account as super_admin
UPDATE caregivers 
SET role = 'super_admin' 
WHERE email = 'mikefarley@msn.com';

-- Verify the change
SELECT name, email, role, patient_ids 
FROM caregivers 
WHERE email = 'mikefarley@msn.com';
