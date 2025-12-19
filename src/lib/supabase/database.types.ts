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
      leads: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          company: string
          role: string
          status: 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost'
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          company: string
          role: string
          status?: 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost'
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          role?: string
          status?: 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost'
          source?: string
          created_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          lead_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          type?: 'call' | 'email' | 'meeting' | 'note'
          content?: string
          created_at?: string
        }
      }
    }
  }
}

