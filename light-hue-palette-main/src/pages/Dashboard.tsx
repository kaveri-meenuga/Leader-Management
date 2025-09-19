import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Header } from '@/components/layout/Header';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { useLeads } from '@/hooks/useLeads';
import { Lead, LeadFormData } from '@/types/lead';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  TrendingUp,
  Users,
  Target,
  DollarSign
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Dashboard: React.FC = () => {
  const {
    leads,
    isLoading,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    totalPages,
    createLead,
    updateLead,
    deleteLead,
  } = useLeads();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // Status badge variants
  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-purple-100 text-purple-700 border-purple-200',
      contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      qualified: 'bg-green-100 text-green-700 border-green-200',
      won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      lost: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700'} font-medium`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Source badge variants
  const getSourceBadge = (source: string) => {
    const variants = {
      website: 'bg-pink-100 text-pink-700',
      google_ads: 'bg-orange-100 text-orange-700',
      facebook_ads: 'bg-purple-100 text-purple-700',
      referral: 'bg-green-100 text-green-700',
      events: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700',
    };

    const labels = {
      website: 'Website',
      google_ads: 'Google Ads',
      facebook_ads: 'Facebook Ads',
      referral: 'Referral',
      events: 'Events',
      other: 'Other',
    };
    
    return (
      <Badge 
        variant="secondary" 
        className={`${variants[source as keyof typeof variants] || variants.other} text-xs`}
      >
        {labels[source as keyof typeof labels] || source}
      </Badge>
    );
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'name',
      header: 'Contact',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-foreground">
              {lead.first_name} {lead.last_name}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{lead.phone}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{lead.company}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{lead.city}, {lead.state}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => getSourceBadge(row.getValue('source')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => {
        const score = row.getValue('score') as number;
        const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
        return (
          <div className={`font-medium ${color} flex items-center space-x-1`}>
            <TrendingUp className="h-3 w-3" />
            <span>{score}/100</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'lead_value',
      header: 'Value',
      cell: ({ row }) => {
        const value = row.getValue('lead_value') as number;
        return (
          <div className="flex items-center space-x-1 font-medium text-foreground">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span>${value.toLocaleString()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'is_qualified',
      header: 'Qualified',
      cell: ({ row }) => {
        const isQualified = row.getValue('is_qualified') as boolean;
        return isQualified ? (
          <Badge variant="outline" className="bg-success-light text-success border-success/20">
            <Target className="h-3 w-3 mr-1" />
            Yes
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            No
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(lead)}
              className="h-8 w-8 p-0 hover:bg-hover"
              aria-label={`Edit ${lead.first_name} ${lead.last_name}`}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingLead(lead)}
              className="h-8 w-8 p-0 hover:bg-hover text-destructive hover:text-destructive"
              aria-label={`Delete ${lead.first_name} ${lead.last_name}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: LeadFormData) => {
    if (editingLead) {
      await updateLead(editingLead.id, data);
    } else {
      await createLead(data);
    }
  };

  const handleDelete = async () => {
    if (deletingLead) {
      await deleteLead(deletingLead.id);
      setDeletingLead(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  // Stats calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.is_qualified).length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.lead_value, 0);
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your sales leads effectively
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
              </div>
              <div className="p-3 bg-primary-lighter rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold text-foreground">{qualifiedLeads}</p>
              </div>
              <div className="p-3 bg-success-light rounded-lg">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-warning-light rounded-lg">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">{avgScore}</p>
              </div>
              <div className="p-3 bg-primary-lighter rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-card rounded-lg border border-border shadow-subtle">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={leads}
              pagination={pagination}
              totalPages={totalPages}
              onPaginationChange={setPagination}
              onGlobalFilterChange={setGlobalFilter}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Lead Form Dialog */}
      <LeadFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        lead={editingLead}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingLead} onOpenChange={() => setDeletingLead(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingLead?.first_name} {deletingLead?.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};