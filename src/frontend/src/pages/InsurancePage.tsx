import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetInsuranceInquiries, useSubmitInsuranceInquiry } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { Shield, Heart, Car, Home, FileText } from 'lucide-react';
import { InsuranceCategory, Variant_submitted_reviewed } from '../backend';
import { formatCurrency, formatDate } from '../utils/finance';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function InsurancePage() {
  const { data: inquiries, isLoading, error, refetch } = useGetInsuranceInquiries();
  const submitInquiry = useSubmitInsuranceInquiry();

  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory | null>(null);
  const [coverageAmount, setCoverageAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [contactPreference, setContactPreference] = useState('');

  const categories = [
    {
      id: InsuranceCategory.health,
      label: 'Health Insurance',
      icon: Heart,
      description: 'Comprehensive health coverage for you and your family',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      id: InsuranceCategory.life,
      label: 'Life Insurance',
      icon: Shield,
      description: 'Protect your loved ones with life insurance',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: InsuranceCategory.vehicle,
      label: 'Vehicle Insurance',
      icon: Car,
      description: 'Complete coverage for your vehicles',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: InsuranceCategory.home,
      label: 'Home Insurance',
      icon: Home,
      description: 'Protect your home and belongings',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error('Please select an insurance category');
      return;
    }

    const amountNum = parseFloat(coverageAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid coverage amount');
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        category: selectedCategory,
        coverageAmount: BigInt(Math.floor(amountNum * 100)),
        notes: notes.trim(),
        contactPreference: contactPreference.trim(),
      });

      toast.success('Insurance inquiry submitted successfully');
      setSelectedCategory(null);
      setCoverageAmount('');
      setNotes('');
      setContactPreference('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit inquiry');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Insurance
        </h1>
        <p className="text-muted-foreground">Explore insurance options and submit inquiries</p>
      </div>

      {/* Insurance Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-2 border-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader>
                <div className={`h-12 w-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-2`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <CardDescription className="text-xs">{category.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Inquiry Form */}
      {selectedCategory && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Submit Insurance Inquiry</CardTitle>
            <CardDescription>
              Fill in the details for {categories.find((c) => c.id === selectedCategory)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverageAmount">Coverage Amount (USD) *</Label>
                <Input
                  id="coverageAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPreference">Contact Preference *</Label>
                <Input
                  id="contactPreference"
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value)}
                  placeholder="Email or Phone"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements or questions"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={submitInquiry.isPending}>
                  {submitInquiry.isPending ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedCategory(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* My Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Inquiries
          </CardTitle>
          <CardDescription>Track your insurance inquiry status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading inquiries..." />
          ) : error ? (
            <ErrorState message="Failed to load inquiries" onRetry={() => refetch()} />
          ) : !inquiries || inquiries.length === 0 ? (
            <EmptyState
              title="No inquiries yet"
              description="Your insurance inquiries will appear here"
            />
          ) : (
            <div className="space-y-3">
              {inquiries.map((inquiry, index) => {
                const categoryInfo = categories.find((c) => c.id === inquiry.category);
                const Icon = categoryInfo?.icon || Shield;
                return (
                  <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${categoryInfo?.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${categoryInfo?.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold">{categoryInfo?.label}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(inquiry.timestamp)}</p>
                        </div>
                      </div>
                      <Badge variant={inquiry.status === Variant_submitted_reviewed.submitted ? 'secondary' : 'default'}>
                        {inquiry.status === Variant_submitted_reviewed.reviewed ? 'Reviewed' : 'Submitted'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Coverage Amount</p>
                        <p className="font-medium">{formatCurrency(inquiry.coverageAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-medium">{inquiry.contactPreference}</p>
                      </div>
                    </div>
                    {inquiry.notes && (
                      <p className="text-sm text-muted-foreground italic">{inquiry.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
