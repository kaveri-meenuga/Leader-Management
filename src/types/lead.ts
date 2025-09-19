export type LeadSource = 'website' | 'facebook_ads' | 'google_ads' | 'referral' | 'events' | 'other';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0-100
  lead_value: number;
  last_activity_at: string | null;
  is_qualified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  lead_value: number;
  is_qualified: boolean;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}