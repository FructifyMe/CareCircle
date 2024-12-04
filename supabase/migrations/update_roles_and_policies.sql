-- Update caregivers table role constraint
ALTER TABLE caregivers DROP CONSTRAINT caregivers_role_check;
ALTER TABLE caregivers ADD CONSTRAINT caregivers_role_check 
    CHECK (role IN ('super_admin', 'admin', 'caregiver'));

-- Drop existing policies
DROP POLICY IF EXISTS "Caregivers can view their own record" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update their own record" ON caregivers;
DROP POLICY IF EXISTS "Admins can view all caregivers" ON caregivers;
DROP POLICY IF EXISTS "Admins can create caregivers" ON caregivers;
DROP POLICY IF EXISTS "Admins can update caregivers" ON caregivers;

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
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = email
        AND role IS NOT DISTINCT FROM OLD.role  -- Prevent role changes
        AND patient_ids IS NOT DISTINCT FROM OLD.patient_ids  -- Prevent patient assignment changes
    );

-- Policies for patients table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON patients;
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
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON care_shifts;
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
    )
    WITH CHECK (
        caregiver_id = (
            SELECT id FROM caregivers 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Policies for care_tasks table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON care_tasks;
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
    )
    WITH CHECK (
        -- Only allow updating status and notes
        (OLD.title = NEW.title)
        AND (OLD.description = NEW.description)
        AND (OLD.due_date = NEW.due_date)
        AND (OLD.priority = NEW.priority)
        AND (OLD.patient_id = NEW.patient_id)
        AND (OLD.caregiver_id = NEW.caregiver_id)
    );

-- Insert super admin if not exists (you'll need to update this with your email)
INSERT INTO caregivers (name, email, role, auth_id)
VALUES ('Mike Farley', 'mikefarley@msn.com', 'super_admin', (SELECT id FROM auth.users WHERE email = 'mikefarley@msn.com'))
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
