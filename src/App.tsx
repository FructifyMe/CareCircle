import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ShiftManager } from './components/shifts/ShiftManager';
import { TaskManager } from './components/tasks/TaskManager';
import { ChatWindow } from './components/chat/ChatWindow';
import { ExpenseManager } from './components/expenses/ExpenseManager';
import { PatientOnboardingForm } from './components/patient/PatientOnboardingForm';
import { Settings } from './pages/Settings';
import { useCareStore } from './store/careStore';
import { SupabaseTest } from './components/SupabaseTest';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentCaregiver = useCareStore(state => state.currentCaregiver);
  
  if (!currentCaregiver) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentCaregiver = useCareStore(state => state.currentCaregiver);
  
  if (!currentCaregiver || currentCaregiver.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentCaregiver = useCareStore(state => state.currentCaregiver);
  
  console.log('SuperAdminRoute - currentCaregiver:', currentCaregiver);
  console.log('SuperAdminRoute - role:', currentCaregiver?.role);
  
  if (!currentCaregiver || currentCaregiver.role !== 'super_admin') {
    console.log('Access denied - redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<><SupabaseTest /><Dashboard /></>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/super-admin" element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          } />
          <Route path="/shifts" element={<ShiftManager />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/expenses" element={<ExpenseManager />} />
          <Route path="/onboarding" element={
            <AdminRoute>
              <PatientOnboardingForm />
            </AdminRoute>
          } />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;