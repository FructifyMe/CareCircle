import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useCareStore } from '../store/careStore';
import { Stethoscope } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { currentCaregiver, signIn, signUp } = useCareStore();

  if (currentCaregiver) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (email: string, password: string, name?: string) => {
    if (isSignUp) {
      await signUp(email, password, name!);
    } else {
      await signIn(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <Stethoscope className="w-10 h-10 text-primary-600" />
        <div>
          <span className="text-2xl font-bold text-primary-600">CareCircle</span>
          <span className="text-sm block text-secondary-500">Care Coordination Platform</span>
          <span className="text-xs block text-secondary-400">by Fructify LLC</span>
        </div>
      </div>

      <AuthForm
        onSubmit={handleSubmit}
        isSignUp={isSignUp}
      />

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-sm text-primary-600 hover:text-primary-700"
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};