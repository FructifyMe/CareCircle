-- Check caregivers table
SELECT * FROM caregivers;

-- Check patients table
SELECT * FROM patients;

-- Check the relationship
SELECT c.name as caregiver_name, c.email, c.patient_ids, 
       p.name as patient_name, p.id as patient_id
FROM caregivers c
LEFT JOIN patients p ON p.id = ANY(c.patient_ids);
