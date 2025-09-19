import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '@/types/lead';
import { Alert, AlertDescription } from '@/components/ui/alert';

const leadFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().min(1, 'Company is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  source: z.enum(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']),
  score: z.number().min(0).max(100),
  lead_value: z.number().min(0),
  is_qualified: z.boolean(),
});

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: Lead | null;
  isLoading?: boolean;
}

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'won', label: 'Won' },
];

export const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  lead,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      city: '',
      state: '',
      source: 'website',
      status: 'new',
      score: 50,
      lead_value: 0,
      is_qualified: false,
    },
  });

  const watchedSource = watch('source');
  const watchedStatus = watch('status');
  const watchedIsQualified = watch('is_qualified');

  useEffect(() => {
    if (open && lead) {
      // Populate form with lead data when editing
      reset({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        city: lead.city,
        state: lead.state,
        source: lead.source,
        status: lead.status,
        score: lead.score,
        lead_value: lead.lead_value,
        is_qualified: lead.is_qualified,
      });
    } else if (open) {
      // Reset form for new lead
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        state: '',
        source: 'website',
        status: 'new',
        score: 50,
        lead_value: 0,
        is_qualified: false,
      });
    }
  }, [open, lead, reset]);

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Lead: ${lead?.first_name} ${lead?.last_name}` : 'Add New Lead'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the lead information below.' 
              : 'Fill in the information to create a new lead.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  placeholder="John"
                  aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                />
                {errors.first_name && (
                  <p id="first_name-error" className="text-sm text-destructive" role="alert">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...register('last_name')}
                  placeholder="Smith"
                  aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                />
                {errors.last_name && (
                  <p id="last_name-error" className="text-sm text-destructive" role="alert">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="(555) 123-4567"
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Acme Corp"
                aria-describedby={errors.company ? 'company-error' : undefined}
              />
              {errors.company && (
                <p id="company-error" className="text-sm text-destructive" role="alert">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="San Francisco"
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p id="city-error" className="text-sm text-destructive" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="CA"
                  aria-describedby={errors.state ? 'state-error' : undefined}
                />
                {errors.state && (
                  <p id="state-error" className="text-sm text-destructive" role="alert">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lead Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select 
                  value={watchedSource} 
                  onValueChange={(value) => setValue('source', value as LeadSource)}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.source.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={watchedStatus} 
                  onValueChange={(value) => setValue('status', value as LeadStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Score (0-100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  {...register('score', { valueAsNumber: true })}
                  aria-describedby={errors.score ? 'score-error' : undefined}
                />
                {errors.score && (
                  <p id="score-error" className="text-sm text-destructive" role="alert">
                    {errors.score.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead_value">Lead Value ($)</Label>
                <Input
                  id="lead_value"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('lead_value', { valueAsNumber: true })}
                  aria-describedby={errors.lead_value ? 'lead_value-error' : undefined}
                />
                {errors.lead_value && (
                  <p id="lead_value-error" className="text-sm text-destructive" role="alert">
                    {errors.lead_value.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_qualified"
                checked={watchedIsQualified}
                onCheckedChange={(checked) => setValue('is_qualified', !!checked)}
              />
              <Label 
                htmlFor="is_qualified"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as qualified lead
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Lead' : 'Create Lead'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};