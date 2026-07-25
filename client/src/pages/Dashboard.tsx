import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  LogOut,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
  Archive,
  Menu,
  X,
  Moon,
  Sun,
  Inbox,
  ExternalLink,
  MessageSquareCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { Button } from '../components/ui/Button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.js';
import { Input } from '../components/ui/Input.js';
import { Dialog } from '../components/ui/Dialog.js';
import { Skeleton } from '../components/ui/Skeleton.js';
import { Lead, LeadsResponse, LeadStatus } from '../types/index.js';

export const Dashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [page, setPage] = useState(1);
  const limit = 6;

  // Sidebar Open state (Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Message Details Dialog state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Lead | null>(null);

  // 1. Fetch leads query using TanStack Query
  const { data, isLoading, isError } = useQuery<LeadsResponse>({
    queryKey: ['leads', page, search, statusFilter],
    queryFn: async () => {
      const response = await api.get('/leads', {
        params: {
          page,
          limit,
          search,
          status: statusFilter,
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  // 2. Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const response = await api.patch(`/leads/${id}`, { status });
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Status updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    },
  });

  // 3. Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Lead deleted successfully.');
      setIsDeleteOpen(false);
      setLeadToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete lead.');
    },
  });

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const openDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (leadToDelete) {
      deleteLeadMutation.mutate(leadToDelete._id);
    }
  };

  const openDetailsDialog = (lead: Lead) => {
    setSelectedLeadDetails(lead);
    setIsDetailsOpen(true);
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (!data?.leads || data.leads.length === 0) {
      toast.error('No leads available to export.');
      return;
    }

    const headers = ['Name', 'Email', 'Budget', 'Status', 'Message', 'Submission Date'];
    const rows = data.leads.map((lead) => [
      lead.name,
      lead.email,
      lead.budget,
      lead.status,
      lead.message.replace(/"/g, '""'), // escape quotes
      new Date(lead.createdAt).toLocaleString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadDesk_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads CSV downloaded.');
  };

  // Data preparation for charts
  const stats = data?.stats;

  // Chart 1: Status Distribution
  const pieData = stats
    ? [
        { name: 'New', value: stats.newLeads, color: '#3b82f6' },
        { name: 'Contacted', value: stats.contactedLeads, color: '#f59e0b' },
        { name: 'Closed', value: stats.closedLeads, color: '#10b981' },
      ].filter((d) => d.value > 0)
    : [];

  // Chart 2: Budgets
  const budgetOrder = ['Under $500', '$500–$1000', '$1000–$5000', 'Above $5000'];
  const barData = stats?.budgetStats
    ? budgetOrder.map((range) => {
        const item = stats.budgetStats.find((b) => b._id === range);
        return {
          name: range,
          leads: item ? item.count : 0,
        };
      })
    : [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
      {/* BACKGROUND DECORATIONS */}
      <div className="glow-blob top-[20%] left-[25%] bg-blue-500/10" />
      <div className="glow-blob bottom-[20%] right-[25%] bg-indigo-500/10" />

      {/* 1. SIDEBAR */}
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white/80 dark:border-slate-850 dark:bg-slate-900/80 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-850">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-550 text-white font-extrabold shadow-md shadow-brand-500/15">
              LM
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              LeadDesk Mini
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-650 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          <button className="flex w-full items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
            <Layers className="h-4 w-4" />
            Overview Dashboard
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-850">
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-550 text-white font-bold text-xs uppercase">
              {authState.admin?.email.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {authState.admin?.email}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* HEADER NAVBAR */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-md px-4 sm:px-6 dark:border-slate-850 dark:bg-slate-950/75">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:text-slate-400 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Welcome back!</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Here is your lead capture pipeline status.</p>
          </div>

          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:text-slate-400"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2 rounded-xl text-xs font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* A. SUMMARY CARDS */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Card 1: Total */}
            <Card className="relative overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Leads
                  </span>
                  <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.totalLeads ?? 0}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: New */}
            <Card className="relative overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    New Leads
                  </span>
                  <div className="rounded-xl bg-blue-600/10 p-2 text-blue-600 dark:text-blue-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {stats?.newLeads ?? 0}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Contacted */}
            <Card className="relative overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Contacted
                  </span>
                  <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className="text-2xl font-extrabold text-amber-500">
                      {stats?.contactedLeads ?? 0}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Closed */}
            <Card className="relative overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Closed
                  </span>
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                    <Archive className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className="text-2xl font-extrabold text-emerald-500">
                      {stats?.closedLeads ?? 0}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* B. ANALYTICS CHARTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Chart 1: Status breakdown */}
            <Card className="border border-slate-200/50 dark:border-slate-800/40">
              <CardHeader>
                <CardTitle className="text-base font-bold">Pipeline Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : pieData.length === 0 ? (
                  <div className="flex h-[250px] flex-col items-center justify-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-2 stroke-1" />
                    <span className="text-xs">No status data to plot</span>
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart 2: Budgets breakdown */}
            <Card className="border border-slate-200/50 dark:border-slate-800/40">
              <CardHeader>
                <CardTitle className="text-base font-bold">Leads by Budget Range</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : barData.every((b) => b.leads === 0) ? (
                  <div className="flex h-[250px] flex-col items-center justify-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-2 stroke-1" />
                    <span className="text-xs">No budget data to plot</span>
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
                        <Bar dataKey="leads" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* C. CONTROLS ROW */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search and Filters */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:max-w-xl">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 rounded-xl"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset page to 1
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-48">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setPage(1); // Reset page to 1
                  }}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CSV Export */}
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2 rounded-xl text-xs font-semibold py-2.5 glass-panel"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          </div>

          {/* D. LEAD TABLE CARD */}
          <Card className="overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Budget</th>
                    <th scope="col" className="px-6 py-4">Message</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Date</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-850">
                  {isLoading ? (
                    // Skeleton Rows
                    [...Array(limit)].map((_, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="ml-auto h-8 w-16 rounded-xl" /></td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-red-500 font-semibold">
                        Failed to fetch leads. Please check connection and try again.
                      </td>
                    </tr>
                  ) : data?.leads && data.leads.length > 0 ? (
                    data.leads.map((lead) => (
                      <tr
                        key={lead._id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-white">
                          {lead.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-700 dark:text-slate-350">
                          {lead.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800 dark:text-slate-300">
                          {lead.budget}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                          <button
                            onClick={() => openDetailsDialog(lead)}
                            className="inline-flex items-center gap-1 hover:text-brand-550 text-left"
                            title="Click to view full message"
                          >
                            {lead.message}
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {/* Inline Status Dropdown */}
                          <div className="relative inline-block text-left">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead._id, e.target.value as LeadStatus)}
                              className={`appearance-none rounded-full px-3 py-1 pr-6 text-xs font-semibold border-none focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                                lead.status === 'New'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                  : lead.status === 'Contacted'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                              <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(lead.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <button
                            onClick={() => openDeleteDialog(lead)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Empty State
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 mb-4 border border-slate-200/40 dark:border-slate-800/40">
                            <Inbox className="h-6 w-6 stroke-1.5" />
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">No Leads Found</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                            No captured leads match your search query or status filter. Try clearing filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* E. PAGINATION CONTROLS */}
            {data && data.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-white/50 px-6 py-4 dark:border-slate-850 dark:bg-slate-900/50">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Showing page {data.pagination.currentPage} of {data.pagination.totalPages} ({data.pagination.totalLeads} total leads)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-xl py-1.5"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === data.pagination.totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, data.pagination.totalPages))}
                    className="rounded-xl py-1.5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Lead Deletion"
        description="Are you absolutely sure you want to delete this lead? This action is permanent and cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLeadMutation.isPending}
      >
        {leadToDelete && (
          <div className="rounded-xl bg-slate-100 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800/40 text-sm space-y-2 mt-2">
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase block">Name</span>
              <span className="font-semibold text-slate-900 dark:text-white">{leadToDelete.name}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase block">Email</span>
              <span className="text-slate-700 dark:text-slate-350">{leadToDelete.email}</span>
            </div>
          </div>
        )}
      </Dialog>

      {/* MESSAGE DETAILS DIALOG */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Inquiry Details"
        cancelText="Close"
      >
        {selectedLeadDetails && (
          <div className="space-y-4 text-sm mt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">Sender Name</span>
                <span className="font-semibold text-slate-900 dark:text-white text-base">{selectedLeadDetails.name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">Pipeline Stage</span>
                <span className={`inline-block rounded-full px-2.5 py-0.5 mt-1 text-xs font-semibold ${
                  selectedLeadDetails.status === 'New'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    : selectedLeadDetails.status === 'Contacted'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}>
                  {selectedLeadDetails.status}
                </span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">Email Address</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedLeadDetails.email}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">Budget Range</span>
                <span className="text-slate-850 dark:text-slate-250 font-bold">{selectedLeadDetails.budget}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">Submitted On</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {new Date(selectedLeadDetails.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-850 pt-3">
              <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <MessageSquareCode className="h-3.5 w-3.5" />
                Message Inquiry
              </span>
              <p className="rounded-xl bg-slate-100/70 dark:bg-slate-950/70 p-4 border border-slate-200/40 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedLeadDetails.message}
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
