import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface AuthFormProps {
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
  isSignUp?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(email, password, isSignUp ? name : undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              icon={<User className="w-5 h-5 text-secondary-400" />}
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            icon={<Mail className="w-5 h-5 text-secondary-400" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            icon={<Lock className="w-5 h-5 text-secondary-400" />}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};