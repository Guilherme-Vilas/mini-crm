export type LeadStatus = 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost';
export type InteractionType = 'call' | 'email' | 'meeting' | 'note';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: LeadStatus;
  source: string;
  created_at: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  type: InteractionType;
  content: string;
  created_at: string;
}

export interface LeadWithInteractions extends Lead {
  interactions?: Interaction[];
}

