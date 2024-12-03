import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PatientInfo } from '../patient/PatientInfo';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <PatientInfo />
          <Outlet />
        </div>
      </main>
    </div>
  );
};