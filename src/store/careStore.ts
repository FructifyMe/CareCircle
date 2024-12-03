import { create } from 'zustand';
import type { 
  Caregiver, Patient, CareShift, CareTask, 
  ChatMessage, Expense 
} from '../types/care';

interface CareStore {
  // Auth State
  currentCaregiver: Caregiver | null;
  currentPatient: Patient | null;
  
  // Data
  patients: Patient[];
  shifts: CareShift[];
  tasks: CareTask[];
  messages: ChatMessage[];
  expenses: Expense[];
  
  // Auth Actions
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Patient Actions
  setCurrentPatient: (patient: Patient | null) => void;
  updatePatient: (patient: Patient) => void;
  
  // Shift Actions
  addShift: (shift: CareShift) => void;
  updateShift: (shiftId: string, updates: Partial<CareShift>) => void;
  assignShift: (shiftId: string, caregiverId: string) => void;
  
  // Task Actions
  addTask: (task: CareTask) => void;
  updateTask: (taskId: string, updates: Partial<CareTask>) => void;
  completeTask: (taskId: string) => void;
  
  // Message Actions
  addMessage: (message: ChatMessage) => void;
  
  // Expense Actions
  addExpense: (expense: Expense) => void;
  updateExpense: (expenseId: string, updates: Partial<Expense>) => void;
}

export const useCareStore = create<CareStore>((set, get) => ({
  // Initial State
  currentCaregiver: null,
  currentPatient: null,
  patients: [],
  shifts: [],
  tasks: [],
  messages: [],
  expenses: [],

  // Auth Actions
  initializeAuth: async () => {
    // TODO: Implement with Supabase
    // For now, set mock data
    set({
      currentCaregiver: {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-0123',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
        role: 'caregiver',
        patientIds: ['1'],
        created_at: new Date().toISOString()
      }
    });
  },

  signIn: async (email: string, password: string) => {
    // TODO: Implement with Supabase
    console.log('Sign in:', { email, password });
  },

  signUp: async (email: string, password: string, name: string) => {
    // TODO: Implement with Supabase
    console.log('Sign up:', { email, password, name });
  },

  signOut: async () => {
    // TODO: Implement with Supabase
    set({ currentCaregiver: null, currentPatient: null });
  },

  // Patient Actions
  setCurrentPatient: (patient) => {
    set({ currentPatient: patient });
  },

  updatePatient: (patient) => {
    set((state) => ({
      patients: state.patients.map(p => 
        p.id === patient.id ? patient : p
      )
    }));
  },

  // Shift Actions
  addShift: (shift) => {
    set((state) => ({
      shifts: [...state.shifts, shift]
    }));
  },

  updateShift: (shiftId, updates) => {
    set((state) => ({
      shifts: state.shifts.map(shift =>
        shift.id === shiftId ? { ...shift, ...updates } : shift
      )
    }));
  },

  assignShift: (shiftId, caregiverId) => {
    set((state) => ({
      shifts: state.shifts.map(shift =>
        shift.id === shiftId
          ? { ...shift, caregiverId, status: 'assigned' }
          : shift
      )
    }));
  },

  // Task Actions
  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task]
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  },

  completeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed' }
          : task
      )
    }));
  },

  // Message Actions
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  // Expense Actions
  addExpense: (expense) => {
    set((state) => ({
      expenses: [...state.expenses, expense]
    }));
  },

  updateExpense: (expenseId, updates) => {
    set((state) => ({
      expenses: state.expenses.map(expense =>
        expense.id === expenseId ? { ...expense, ...updates } : expense
      )
    }));
  }
}));