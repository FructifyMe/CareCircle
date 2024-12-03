import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, MessageSquare, DollarSign, Settings, 
  LogOut, ClipboardList, UserPlus, Stethoscope 
} from 'lucide-react';
import { useCareStore } from '../../store/careStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const currentCaregiver = useCareStore(state => state.currentCaregiver);
  const isAdmin = currentCaregiver?.role === 'admin';

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Sign out');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', to: '/' },
    { icon: Calendar, label: 'Shifts', to: '/shifts' },
    { icon: ClipboardList, label: 'Tasks', to: '/tasks' },
    { icon: MessageSquare, label: 'Chat', to: '/chat' },
    { icon: DollarSign, label: 'Expenses', to: '/expenses' },
    // Only show Add Patient for admin users
    ...(isAdmin ? [{ icon: UserPlus, label: 'Add Patient', to: '/onboarding' }] : []),
    { icon: Settings, label: 'Settings', to: '/settings' }
  ];

  return (
    <div className="bg-white border-r border-gray-200 text-secondary-600 w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Stethoscope className="w-8 h-8 text-primary-600" />
        <div>
          <span className="text-xl font-bold text-primary-600">CareCircle</span>
          <span className="text-xs block text-secondary-500">Care Coordination Platform</span>
          <span className="text-xs block text-secondary-400">by Fructify LLC</span>
        </div>
      </div>
      
      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 w-full p-3 rounded-lg transition-colors
              ${isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'hover:bg-gray-50 text-secondary-600'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-6 px-3">
          <img
            src={currentCaregiver?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40"}
            alt="Caregiver profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-secondary-900">
              {currentCaregiver?.name || 'Guest User'}
            </p>
            <p className="text-xs text-secondary-500">
              {currentCaregiver?.role === 'admin' ? 'Administrator' : 'Caregiver'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full p-3 text-secondary-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};