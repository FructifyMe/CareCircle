-- Check current role
SELECT name, email, role, patient_ids 
FROM caregivers 
WHERE email = 'mikefarley@msn.com';
