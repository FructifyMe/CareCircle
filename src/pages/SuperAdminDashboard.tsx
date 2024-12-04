import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import type { Patient, Caregiver, PatientAssignment } from '../types/care';
import { useCareStore } from '../store/careStore';
import { UserManagementModal } from '../components/modals/UserManagementModal';

export const SuperAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<Caregiver | null>(null);
  const { 
    patients, 
    caregivers,
    updateCaregiver, 
    fetchCaregivers,
    fetchPatients
  } = useCareStore();

  useEffect(() => {
    fetchCaregivers();
    fetchPatients();
  }, [fetchCaregivers, fetchPatients]);

  const handleUpdateUserRole = async (userId: string, newRole: 'super_admin' | 'admin' | 'caregiver') => {
    const user = caregivers.find(c => c.id === userId);
    if (!user) return;

    try {
      await updateCaregiver({
        ...user,
        role: newRole
      });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Filter caregivers by search term
  const filteredCaregivers = caregivers?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!caregivers) {
    return <div className="p-4">Loading caregivers...</div>;
  }

  return (
    <>
      {selectedUser && (
        <UserManagementModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Super Admin Dashboard</h1>
            <p className="text-secondary-600">Manage users and their roles</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: patients?.length || 0 },
            { label: 'Active Care Teams', value: 0 }, // Temporarily removed assignments count
            { label: 'Total Admins', value: caregivers?.filter(c => c.role === 'admin')?.length || 0 },
            { label: 'Total Caregivers', value: caregivers?.filter(c => c.role === 'caregiver')?.length || 0 }
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-secondary-600">{label}</p>
              <p className="text-2xl font-semibold text-secondary-900">{value}</p>
            </div>
          ))}
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-secondary-900">User Management</h2>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Patients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCaregivers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'super_admin' | 'admin' | 'caregiver')}
                          className="text-sm text-secondary-900 border-gray-300 rounded-md"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="caregiver">Caregiver</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-secondary-900">
                          {user.patientIds?.length || 0} patients
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};