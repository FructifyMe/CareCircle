import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, MessageSquare, DollarSign, Settings, 
  LogOut, ClipboardList, UserPlus, Stethoscope 
} from 'lucide-react';
import { useCareStore } from '../../store/careStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { currentCaregiver, signOut } = useCareStore();
  console.log('Sidebar - currentCaregiver:', currentCaregiver);
  const isAdmin = currentCaregiver?.role === 'admin';
  const isSuperAdmin = currentCaregiver?.role === 'super_admin';
  console.log('Sidebar - isSuperAdmin:', isSuperAdmin);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', to: '/dashboard' },
    ...(isSuperAdmin ? [{ icon: UserPlus, label: 'Super Admin', to: '/super-admin' }] : []),
    { icon: Calendar, label: 'Shifts', to: '/shifts' },
    { icon: ClipboardList, label: 'Tasks', to: '/tasks' },
    { icon: MessageSquare, label: 'Chat', to: '/chat' },
    { icon: DollarSign, label: 'Expenses', to: '/expenses' },
    ...(isAdmin ? [{ icon: UserPlus, label: 'Onboarding', to: '/onboarding' }] : []),
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-xl font-bold text-primary-600">CareCircle</h1>
            <p className="text-xs text-gray-500">Care Coordination Platform</p>
            <p className="text-xs text-gray-500">by Fructify LLC</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        {currentCaregiver && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {currentCaregiver.photo ? (
                <img
                  src={currentCaregiver.photo}
                  alt={currentCaregiver.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  {currentCaregiver.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{currentCaregiver.name}</p>
              <p className="text-xs text-gray-500 capitalize">{currentCaregiver.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 w-full px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};