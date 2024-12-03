import React from 'react';
import { User, Bell, Shield, Key, Globe, Palette, HelpCircle, Mail } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useCareStore } from '../store/careStore';

export const Settings: React.FC = () => {
  const currentCaregiver = useCareStore(state => state.currentCaregiver);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your account and application preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={currentCaregiver?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                {currentCaregiver?.name || 'Guest User'}
              </h2>
              <p className="text-secondary-600">{currentCaregiver?.role || 'Role not set'}</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Profile Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="divide-y divide-gray-200">
          {/* Personal Information */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Personal Information</h3>
                <p className="text-sm text-secondary-600">Update your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                defaultValue={currentCaregiver?.name}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                type="email"
                defaultValue={currentCaregiver?.email}
                placeholder="Enter your email"
              />
              <Input
                label="Phone"
                type="tel"
                defaultValue={currentCaregiver?.phone}
                placeholder="Enter your phone number"
              />
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Notifications</h3>
                <p className="text-sm text-secondary-600">Configure notification preferences</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Email Notifications', defaultChecked: true },
                { label: 'Push Notifications', defaultChecked: true },
                { label: 'SMS Alerts', defaultChecked: false },
                { label: 'Task Reminders', defaultChecked: true },
                { label: 'Shift Updates', defaultChecked: true }
              ].map(({ label, defaultChecked }) => (
                <label key={label} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={defaultChecked}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-secondary-900">{label}</span>
                </label>
              ))}
              <Button className="mt-4">Save Preferences</Button>
            </div>
          </div>

          {/* Security */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Security</h3>
                <p className="text-sm text-secondary-600">Manage your security settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: HelpCircle, title: 'Help Center', description: 'Get help and support' },
          { icon: Mail, title: 'Contact Support', description: 'Reach out to our team' },
          { icon: Globe, title: 'Language', description: 'Change your language' },
          { icon: Palette, title: 'Appearance', description: 'Customize the interface' }
        ].map(({ icon: Icon, title, description }) => (
          <button
            key={title}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-secondary-900">{title}</h3>
              <p className="text-sm text-secondary-600">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};