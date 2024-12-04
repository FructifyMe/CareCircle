import React from 'react';
import { Search, Bell, Filter } from 'lucide-react';
import { TaskManager } from '../components/tasks/TaskManager';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useCareStore } from '../store/careStore';
import { PatientSelector } from '../components/patient/PatientSelector';

export const Dashboard: React.FC = () => {
  const currentPatient = useCareStore(state => state.currentPatient);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Patient Selector */}
      <PatientSelector />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Care Dashboard</h1>
          <p className="text-secondary-600">
            {currentPatient 
              ? `Caring for ${currentPatient.name}`
              : 'Please select a patient to begin'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg text-secondary-600">
            <Filter className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 hover:bg-gray-100 rounded-lg text-secondary-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {currentPatient ? (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Tasks', value: '12', trend: '3 due today' },
              { label: 'Upcoming Shifts', value: '8', trend: 'Next 7 days' },
              { label: 'Unread Messages', value: '5', trend: 'Last 24 hours' },
              { label: 'Recent Expenses', value: '$324', trend: 'This month' }
            ].map(({ label, value, trend }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-secondary-600">{label}</p>
                <p className="text-2xl font-semibold text-secondary-900 mt-1">{value}</p>
                <p className="text-xs text-secondary-500 mt-1">{trend}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskManager />
            </div>
            <div>
              <ChatWindow />
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">Please select a patient to view the dashboard.</p>
        </div>
      )}
    </div>
  );
};