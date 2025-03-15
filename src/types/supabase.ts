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
      bookings: {
        Row: {
          id: string
          time_slot_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_passengers: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          time_slot_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_passengers: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          time_slot_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          number_of_passengers?: number
          status?: string
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