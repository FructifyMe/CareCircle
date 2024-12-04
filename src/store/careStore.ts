import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { 
  Caregiver, Patient, CareShift, CareTask, 
  ChatMessage, Expense, PatientAssignment 
} from '../types/care';

interface CareStore {
  // Auth State
  currentCaregiver: Caregiver | null;
  currentPatient: Patient | null;
  
  // Data
  patients: Patient[];
  caregivers: Caregiver[];
  shifts: CareShift[];
  tasks: CareTask[];
  messages: ChatMessage[];
  expenses: Expense[];
  
  // Auth Actions
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<Caregiver>;
  signOut: () => Promise<void>;
  
  // Patient Actions
  setCurrentPatient: (patientId: string) => void;
  updatePatient: (patient: Patient) => void;
  fetchPatients: () => void;
  
  // Caregiver Actions
  fetchCaregivers: () => Promise<void>;
  updateCaregiver: (caregiver: Caregiver) => Promise<void>;
  
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
  caregivers: [],
  shifts: [],
  tasks: [],
  messages: [],
  expenses: [],

  // Auth Actions
  initializeAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get caregiver profile
        const { data: caregiver } = await supabase
          .from('caregivers')
          .select('*')
          .eq('auth_id', user.id)
          .single();
          
        if (caregiver) {
          set({ currentCaregiver: caregiver });
          
          // Fetch patients for this caregiver
          if (caregiver.patient_ids && caregiver.patient_ids.length > 0) {
            const { data: patients } = await supabase
              .from('patients')
              .select('*')
              .in('id', caregiver.patient_ids);
              
            if (patients && patients.length > 0) {
              set({ 
                patients,
                currentPatient: patients[0] // Set first patient as current
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (user) {
        // First try to get the caregiver by email (more reliable with our policies)
        let { data: caregiver, error: dbError } = await supabase
          .from('caregivers')
          .select('*')
          .eq('email', email)
          .single();

        if (dbError) {
          console.error('Error fetching caregiver by email:', dbError);
          // Fallback to auth_id if email fails
          const { data: caregiverByAuth, error: authDbError } = await supabase
            .from('caregivers')
            .select('*')
            .eq('auth_id', user.id)
            .single();

          if (authDbError) throw authDbError;
          caregiver = caregiverByAuth;
        }

        if (caregiver) {
          console.log('Successfully signed in as:', caregiver);
          console.log('User role:', caregiver.role);
          set({ currentCaregiver: caregiver });
        } else {
          throw new Error('No caregiver profile found');
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      // Step 1: Sign up the user
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('No user returned from signup');

      // Step 2: Create the caregiver profile
      const newCaregiver = {
        name,
        email,
        role: 'caregiver' as const,
        auth_id: user.id,
        patient_ids: [],
      };

      const { data: caregiver, error: dbError } = await supabase
        .from('caregivers')
        .insert(newCaregiver)
        .select()
        .single();

      if (dbError) {
        console.error('Error creating caregiver profile:', dbError);
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw dbError;
      }

      if (caregiver) {
        set({ currentCaregiver: caregiver });
        return caregiver;
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear store state
      set({
        currentCaregiver: null,
        currentPatient: null,
        patients: [],
        caregivers: [],
        shifts: [],
        tasks: [],
        messages: [],
        expenses: []
      });
      
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Patient Actions
  setCurrentPatient: async (patientId: string) => {
    const { patients } = get();
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      set({ currentPatient: patient });
    }
  },

  fetchPatients: async () => {
    const { currentCaregiver } = get();
    console.log('fetchPatients called, currentCaregiver:', currentCaregiver);
    
    try {
      let query = supabase.from('patients').select('*');
      
      // If not super_admin, only fetch assigned patients
      if (currentCaregiver?.role !== 'super_admin' && currentCaregiver?.patient_ids?.length) {
        query = query.in('id', currentCaregiver.patient_ids);
      }

      const { data: patients, error } = await query;

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      
      console.log('Fetched patients:', patients);
      if (patients) {
        set({ patients });
        // Set first patient as current if none selected
        if (!get().currentPatient && patients.length > 0) {
          console.log('Setting first patient as current:', patients[0]);
          set({ currentPatient: patients[0] });
        }
      }
    } catch (error) {
      console.error('Error in fetchPatients:', error);
    }
  },

  updatePatient: (patient) => {
    set((state) => ({
      patients: state.patients.map(p => 
        p.id === patient.id ? patient : p
      )
    }));
  },

  // Caregiver Actions
  fetchCaregivers: async () => {
    try {
      const { data: caregivers, error } = await supabase
        .from('caregivers')
        .select('*');

      if (error) throw error;
      
      set({ caregivers: caregivers || [] });
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  },

  updateCaregiver: async (caregiver) => {
    try {
      const { error } = await supabase
        .from('caregivers')
        .update(caregiver)
        .eq('id', caregiver.id);

      if (error) throw error;

      set(state => ({
        caregivers: state.caregivers.map(c => 
          c.id === caregiver.id ? caregiver : c
        )
      }));
    } catch (error) {
      console.error('Error updating caregiver:', error);
      throw error;
    }
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