export type UserRole = 'super_admin' | 'admin' | 'caregiver';

export interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  role: UserRole;
  patientIds: string[];
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  photo: string;
  condition: string;
  address: string;
  mobilityNeeds?: string;
  dietaryRestrictions: string[];
  notes?: string;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isMainContact: boolean;
}

export interface CareShift {
  id: string;
  patientId: string;
  caregiverId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: 'open' | 'assigned' | 'completed';
  notes?: string;
}

export interface CareTask {
  id: string;
  patientId: string;
  assignedTo: string | null;
  title: string;
  description: string;
  category: 'medication' | 'meals' | 'hygiene' | 'exercise' | 'social' | 'other';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  patientId: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Expense {
  id: string;
  patientId: string;
  amount: number;
  category: 'medical' | 'supplies' | 'food' | 'transportation' | 'other';
  description: string;
  date: string;
  paidBy: string;
  receipt?: string;
}