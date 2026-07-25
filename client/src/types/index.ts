export type LeadStatus = 'New' | 'Contacted' | 'Closed';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
}

export interface LeadPagination {
  totalLeads: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface BudgetStat {
  _id: string;
  count: number;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
  budgetStats: BudgetStat[];
}

export interface LeadsResponse {
  success: boolean;
  leads: Lead[];
  stats: DashboardStats;
  pagination: LeadPagination;
}

export interface SingleLeadResponse {
  success: boolean;
  message: string;
  lead: Lead;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}
