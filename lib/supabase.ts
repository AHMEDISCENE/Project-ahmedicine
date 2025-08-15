import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Server-side admin client (only for API routes)
export const createAdminClient = () => {
  // This check ensures createAdminClient is never called on the client-side
  if (typeof window !== "undefined") {
    throw new Error("Admin client should only be used server-side")
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          owner_name: string
          hospital_name: string
          state: string
          city: string
          patient_name: string
          species: string
          breed: string
          age: number
          sex: string
          tumour_type: string
          anatomical_location: string
          diagnostic_method: string
          diagnosis_date: string
          treatment_protocol?: string
          follow_up_date?: string
          follow_up_outcome?: string
          additional_notes?: string
          radiographs?: string[]
          histopath_slides?: string[]
          clinic_code: string
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_name: string
          hospital_name: string
          state: string
          city: string
          patient_name: string
          species: string
          breed: string
          age: number
          sex: string
          tumour_type: string
          anatomical_location: string
          diagnostic_method: string
          diagnosis_date: string
          treatment_protocol?: string
          follow_up_date?: string
          follow_up_outcome?: string
          additional_notes?: string
          radiographs?: string[]
          histopath_slides?: string[]
          clinic_code: string
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_name?: string
          hospital_name?: string
          state?: string
          city?: string
          patient_name?: string
          species?: string
          breed?: string
          age?: number
          sex?: string
          tumour_type?: string
          anatomical_location?: string
          diagnostic_method?: string
          diagnosis_date?: string
          treatment_protocol?: string
          follow_up_date?: string
          follow_up_outcome?: string
          additional_notes?: string
          radiographs?: string[]
          histopath_slides?: string[]
          clinic_code?: string
          created_by?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          clinic_code: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          clinic_code: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          clinic_code?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
