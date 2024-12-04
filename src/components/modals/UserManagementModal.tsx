import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Caregiver, Patient } from '../../types/care';
import { useCareStore } from '../../store/careStore';

interface UserManagementModalProps {
  user: Caregiver;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ user, onClose }) => {
  const { patients, updateCaregiver } = useCareStore();
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    patientIds: user.patientIds || [],
    isActive: user.isActive !== false // default to true if undefined
  });

  const handleSave = async () => {
    try {
      console.log('Saving user data:', userData);
      await updateCaregiver({
        ...user,
        ...userData
      });
      console.log('Successfully updated user');
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const togglePatient = (patientId: string) => {
    console.log('Toggling patient:', patientId);
    setUserData(prev => {
      const newPatientIds = prev.patientIds.includes(patientId)
        ? prev.patientIds.filter(id => id !== patientId)
        : [...prev.patientIds, patientId];
      console.log('New patient IDs:', newPatientIds);
      return {
        ...prev,
        patientIds: newPatientIds
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Manage User</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <Input
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
                <select
                  value={userData.role}
                  onChange={(e) => setUserData(prev => ({ ...prev, role: e.target.value as Caregiver['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={user.role === 'super_admin'} // Can't change super_admin role
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="caregiver">Caregiver</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userData.isActive}
                    onChange={(e) => setUserData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-secondary-700">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Assignments */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Patient Assignments</h3>
            <div className="border rounded-lg divide-y">
              {patients?.map((patient) => (
                <div key={patient.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">{patient.name}</p>
                    <p className="text-sm text-secondary-500">ID: #{patient.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={userData.patientIds.includes(patient.id)}
                      onChange={() => togglePatient(patient.id)}
                      className="rounded border-gray-300 text-primary-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
