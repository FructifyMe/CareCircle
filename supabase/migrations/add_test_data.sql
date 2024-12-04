-- Insert a test patient
INSERT INTO patients (name, age, condition, address, emergency_contact)
VALUES (
    'John Doe',
    65,
    'Diabetes Type 2',
    '123 Main St, Anytown, USA',
    'Jane Doe (Daughter) - 555-0123'
) RETURNING id;

-- Get the ID of your caregiver record
DO $$
DECLARE
    patient_id UUID;
    caregiver_id UUID;
BEGIN
    -- Get the last inserted patient ID
    SELECT id INTO patient_id FROM patients ORDER BY created_at DESC LIMIT 1;
    
    -- Get your caregiver ID
    SELECT id INTO caregiver_id FROM caregivers WHERE email = 'mike@fructifyme.com';
    
    -- Update your caregiver record with the patient ID
    UPDATE caregivers
    SET patient_ids = array_append(COALESCE(patient_ids, '{}'), patient_id)
    WHERE id = caregiver_id;
END $$;
