import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import type { Patient, Caregiver, PatientAssignment } from '../types/care';
import { useCareStore } from '../store/careStore';

export const SuperAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { patients, caregivers, assignments } = useCareStore();

  const handleAssignAdmin = async (patientId: string, adminId: string) => {
    // TODO: Implement with Supabase
    console.log('Assign admin:', { patientId, adminId });
  };

  const handleUpdateUserRole = async (userId: string, role: 'admin' | 'caregiver') => {
    // TODO: Implement with Supabase
    console.log('Update user role:', { userId, role });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Super Admin Dashboard</h1>
          <p className="text-secondary-600">Manage patients, admins, and care teams</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Patients', value: patients.length },
          { label: 'Active Care Teams', value: assignments.filter(a => a.status === 'active').length },
          { label: 'Total Caregivers', value: caregivers.length }
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-secondary-600">{label}</p>
            <p className="text-2xl font-semibold text-secondary-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Patient Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Patient Management</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Care Team Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => {
                const assignment = assignments.find(a => a.patientId === patient.id);
                const admin = caregivers.find(c => c.id === assignment?.adminId);

                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-secondary-900">{patient.name}</p>
                          <p className="text-sm text-secondary-500">ID: #{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {admin ? (
                        <div className="text-sm text-secondary-900">{admin.name}</div>
                      ) : (
                        <span className="text-sm text-amber-600">No admin assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assignment?.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {assignment?.status || 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-secondary-900">
                        {caregivers.filter(c => c.patientIds.includes(patient.id)).length} caregivers
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">
                        Manage Team
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Patients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {caregivers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                        <p className="text-sm text-secondary-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'admin' | 'caregiver')}
                      className="px-2 py-1 rounded border border-gray-200 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="caregiver">Caregiver</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-900">
                      {user.patientIds.length} patients
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">
                      Manage Access
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};