import React, { useEffect } from 'react';
import { useCareStore } from '../../store/careStore';

export const PatientSelector: React.FC = () => {
  const { patients, currentPatient, fetchPatients, setCurrentPatient } = useCareStore();

  useEffect(() => {
    console.log('PatientSelector mounted');
    fetchPatients();
  }, [fetchPatients]);

  // Debug logs
  useEffect(() => {
    console.log('Current patients:', patients);
    console.log('Current patient:', currentPatient);
  }, [patients, currentPatient]);

  if (!patients || patients.length === 0) {
    console.log('No patients found');
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">No patients assigned. Please contact your administrator.</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Patient
      </label>
      <select
        id="patient-select"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        value={currentPatient?.id || ''}
        onChange={(e) => {
          console.log('Selected patient ID:', e.target.value);
          setCurrentPatient(e.target.value);
        }}
      >
        <option value="">Select a patient...</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>
    </div>
  );
};
