export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      caregivers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          photo: string | null
          role: 'admin' | 'caregiver'
          patientIds: string[]
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          photo?: string | null
          role?: 'admin' | 'caregiver'
          patientIds?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          photo?: string | null
          role?: 'admin' | 'caregiver'
          patientIds?: string[]
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          age: number
          photo: string | null
          condition: string
          address: string
          emergencyContacts: Json[]
          dietaryRestrictions: string[]
          mobilityNeeds: string | null
          routines: Json[]
          medications: Json[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          photo?: string | null
          condition: string
          address: string
          emergencyContacts?: Json[]
          dietaryRestrictions?: string[]
          mobilityNeeds?: string | null
          routines?: Json[]
          medications?: Json[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          photo?: string | null
          condition?: string
          address?: string
          emergencyContacts?: Json[]
          dietaryRestrictions?: string[]
          mobilityNeeds?: string | null
          routines?: Json[]
          medications?: Json[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}