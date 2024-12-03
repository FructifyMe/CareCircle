import React, { useState } from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { PhotoUpload } from './PhotoUpload';
import { Plus, X } from 'lucide-react';
import type { Patient, EmergencyContact } from '../../types/care';
import { useCareStore } from '../../store/careStore';

export const PatientOnboardingForm: React.FC = () => {
  const updatePatient = useCareStore(state => state.updatePatient);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Partial<EmergencyContact>[]>([
    { name: '', relationship: '', phone: '', isMainContact: true }
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Handle photo upload
    let photoUrl = '';
    if (photo) {
      // TODO: Implement Supabase storage upload
      // For now, create a temporary URL
      photoUrl = URL.createObjectURL(photo);
    }

    const patient: Partial<Patient> = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      condition: formData.get('condition') as string,
      address: formData.get('address') as string,
      photo: photoUrl,
      mobilityNeeds: formData.get('mobilityNeeds') as string,
      dietaryRestrictions: (formData.get('dietaryRestrictions') as string).split(',').map(s => s.trim()),
      notes: formData.get('notes') as string,
      emergencyContacts: emergencyContacts as EmergencyContact[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // TODO: Add Supabase integration
      updatePatient(patient as Patient);
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: '', relationship: '', phone: '', isMainContact: false }
    ]);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string | boolean) => {
    const updated = emergencyContacts.map((contact, i) => {
      if (i === index) {
        return { ...contact, [field]: value };
      }
      return contact;
    });
    setEmergencyContacts(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Basic Information</h2>
        
        <div className="flex flex-col items-center mb-6">
          <PhotoUpload
            onPhotoSelect={(file) => setPhoto(file)}
            currentPhoto={photo ? URL.createObjectURL(photo) : undefined}
            onPhotoClear={() => setPhoto(null)}
          />
          <p className="text-sm text-secondary-600 mt-2">
            Upload a clear photo of the patient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient Name"
            name="name"
            required
            placeholder="Enter patient's full name"
          />
          <Input
            label="Age"
            name="age"
            type="number"
            required
            placeholder="Enter patient's age"
          />
          <Input
            label="Medical Condition"
            name="condition"
            required
            placeholder="Primary condition or reason for care"
          />
          <div className="md:col-span-2">
            <Input
              label="Address"
              name="address"
              required
              placeholder="Enter patient's home address"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Emergency Contacts</h2>
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Name"
              value={contact.name}
              onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
              required
              placeholder="Contact name"
            />
            <Input
              label="Relationship"
              value={contact.relationship}
              onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
              required
              placeholder="Relationship to patient"
            />
            <div className="relative">
              <Input
                label="Phone"
                value={contact.phone}
                onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                required
                placeholder="Phone number"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEmergencyContact(index)}
                  className="absolute top-8 right-0 p-2 text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addEmergencyContact}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Emergency Contact
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Care Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Mobility Needs"
            name="mobilityNeeds"
            placeholder="Describe any mobility assistance required"
          />
          <Input
            label="Dietary Restrictions"
            name="dietaryRestrictions"
            placeholder="Enter dietary restrictions, separated by commas"
          />
          <TextArea
            label="Additional Notes"
            name="notes"
            rows={4}
            placeholder="Enter any additional information about the patient's care needs"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Patient Profile
        </Button>
      </div>
    </form>
  );
};