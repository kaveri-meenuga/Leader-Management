import { useState, useEffect } from 'react';
import { Lead, LeadFormData, PaginatedResponse } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '(555) 123-4567',
    company: 'TechCorp Solutions',
    city: 'San Francisco',
    state: 'CA',
    source: 'website',
    status: 'new',
    score: 85,
    lead_value: 50000,
    last_activity_at: '2024-01-15T10:30:00Z',
    is_qualified: true,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@innovate.com',
    phone: '(555) 987-6543',
    company: 'Innovate Inc',
    city: 'New York',
    state: 'NY',
    source: 'google_ads',
    status: 'contacted',
    score: 92,
    lead_value: 75000,
    last_activity_at: '2024-01-14T15:45:00Z',
    is_qualified: true,
    created_at: '2024-01-08T14:20:00Z',
    updated_at: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'm.brown@startup.io',
    phone: '(555) 456-7890',
    company: 'Startup Dynamics',
    city: 'Austin',
    state: 'TX',
    source: 'referral',
    status: 'qualified',
    score: 78,
    lead_value: 35000,
    last_activity_at: '2024-01-13T09:15:00Z',
    is_qualified: true,
    created_at: '2024-01-05T11:10:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@enterprise.com',
    phone: '(555) 321-0987',
    company: 'Enterprise Solutions',
    city: 'Chicago',
    state: 'IL',
    source: 'facebook_ads',
    status: 'won',
    score: 95,
    lead_value: 120000,
    last_activity_at: '2024-01-12T16:30:00Z',
    is_qualified: true,
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-12T16:30:00Z',
  },
  {
    id: '5',
    first_name: 'Robert',
    last_name: 'Wilson',
    email: 'r.wilson@consulting.biz',
    phone: '(555) 654-3210',
    company: 'Wilson Consulting',
    city: 'Seattle',
    state: 'WA',
    source: 'events',
    status: 'lost',
    score: 45,
    lead_value: 25000,
    last_activity_at: '2024-01-11T14:00:00Z',
    is_qualified: false,
    created_at: '2024-01-03T13:45:00Z',
    updated_at: '2024-01-11T14:00:00Z',
  },
  // Add more mock leads for pagination testing
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 6}`,
    first_name: `Lead${i + 6}`,
    last_name: `User`,
    email: `lead${i + 6}@example.com`,
    phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    company: `Company ${i + 6}`,
    city: ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle'][i % 5],
    state: ['NY', 'CA', 'IL', 'TX', 'WA'][i % 5],
    source: ['website', 'google_ads', 'facebook_ads', 'referral', 'events'][i % 5] as any,
    status: ['new', 'contacted', 'qualified', 'won', 'lost'][i % 5] as any,
    score: Math.floor(Math.random() * 100),
    lead_value: Math.floor(Math.random() * 100000) + 10000,
    last_activity_at: i % 3 === 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    is_qualified: Math.random() > 0.3,
    created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  })),
];

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const { toast } = useToast();

  // Load leads
  useEffect(() => {
    loadLeads();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredLeads = MOCK_LEADS;
      
      // Apply global filter
      if (globalFilter) {
        const search = globalFilter.toLowerCase();
        filteredLeads = MOCK_LEADS.filter(lead =>
          lead.first_name.toLowerCase().includes(search) ||
          lead.last_name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.company.toLowerCase().includes(search) ||
          lead.city.toLowerCase().includes(search) ||
          lead.state.toLowerCase().includes(search) ||
          lead.source.toLowerCase().includes(search) ||
          lead.status.toLowerCase().includes(search)
        );
      }

      // Apply pagination
      const startIndex = pagination.pageIndex * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

      setLeads(paginatedLeads);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load leads",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createLead = async (leadData: LeadFormData): Promise<Lead> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newLead: Lead = {
        id: Date.now().toString(),
        ...leadData,
        last_activity_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data
      MOCK_LEADS.unshift(newLead);
      
      // Refresh current view
      await loadLeads();

      toast({
        title: "Lead created",
        description: `${newLead.first_name} ${newLead.last_name} has been added to your leads.`,
      });

      return newLead;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create lead",
        description: "Please try again later.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, leadData: Partial<LeadFormData>): Promise<Lead> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingLeadIndex = MOCK_LEADS.findIndex(lead => lead.id === id);
      if (existingLeadIndex === -1) {
        throw new Error('Lead not found');
      }

      const updatedLead = {
        ...MOCK_LEADS[existingLeadIndex],
        ...leadData,
        updated_at: new Date().toISOString(),
      };

      MOCK_LEADS[existingLeadIndex] = updatedLead;
      
      // Refresh current view
      await loadLeads();

      toast({
        title: "Lead updated",
        description: `${updatedLead.first_name} ${updatedLead.last_name} has been updated.`,
      });

      return updatedLead;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update lead",
        description: "Please try again later.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const leadIndex = MOCK_LEADS.findIndex(lead => lead.id === id);
      if (leadIndex === -1) {
        throw new Error('Lead not found');
      }

      const deletedLead = MOCK_LEADS[leadIndex];
      MOCK_LEADS.splice(leadIndex, 1);
      
      // Refresh current view
      await loadLeads();

      toast({
        title: "Lead deleted",
        description: `${deletedLead.first_name} ${deletedLead.last_name} has been removed from your leads.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete lead",
        description: "Please try again later.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPages = () => {
    let filteredCount = MOCK_LEADS.length;
    
    if (globalFilter) {
      const search = globalFilter.toLowerCase();
      filteredCount = MOCK_LEADS.filter(lead =>
        lead.first_name.toLowerCase().includes(search) ||
        lead.last_name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.company.toLowerCase().includes(search) ||
        lead.city.toLowerCase().includes(search) ||
        lead.state.toLowerCase().includes(search) ||
        lead.source.toLowerCase().includes(search) ||
        lead.status.toLowerCase().includes(search)
      ).length;
    }

    return Math.ceil(filteredCount / pagination.pageSize);
  };

  return {
    leads,
    isLoading,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    totalPages: getTotalPages(),
    createLead,
    updateLead,
    deleteLead,
    loadLeads,
  };
};