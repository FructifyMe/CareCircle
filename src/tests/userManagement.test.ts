import { useCareStore } from '../store/careStore';

describe('User Management Tests', () => {
  const testCaregiver = {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Test Caregiver 1',
    email: 'test.caregiver1@example.com',
    role: 'caregiver' as const,
    patientIds: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'],
    isActive: true,
  };

  it('should update caregiver patient assignments correctly', async () => {
    const store = useCareStore.getState();
    
    // Add a new patient assignment
    const updatedCaregiver = {
      ...testCaregiver,
      patientIds: [...testCaregiver.patientIds, '33333333-3333-3333-3333-333333333333']
    };

    // Log the state before update
    console.log('Before update:', {
      originalPatientIds: testCaregiver.patientIds,
      newPatientIds: updatedCaregiver.patientIds
    });

    // Perform the update
    await store.updateCaregiver(updatedCaregiver);

    // Get the updated caregiver from store
    const caregivers = useCareStore.getState().caregivers;
    const savedCaregiver = caregivers.find(c => c.id === testCaregiver.id);

    // Log the state after update
    console.log('After update:', {
      savedCaregiver,
      patientIds: savedCaregiver?.patientIds,
      patient_ids: savedCaregiver?.patient_ids
    });

    // Verify the update
    expect(savedCaregiver).toBeTruthy();
    expect(savedCaregiver?.patientIds).toEqual(updatedCaregiver.patientIds);
    expect(savedCaregiver?.patient_ids).toEqual(updatedCaregiver.patientIds);
  });
});
