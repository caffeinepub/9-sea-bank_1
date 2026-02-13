import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetLoanApplications, useApplyLoan } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { Building2, Car, Home, FileText } from 'lucide-react';
import { LoanType, Variant_submitted_underReview } from '../backend';
import { formatCurrency, formatDate } from '../utils/finance';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function LoansPage() {
  const { data: applications, isLoading, error, refetch } = useGetLoanApplications();
  const applyLoan = useApplyLoan();

  const [activeTab, setActiveTab] = useState('vehicle');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [income, setIncome] = useState('');
  const [purpose, setPurpose] = useState('');
  const [documents, setDocuments] = useState('');

  const loanTypes = [
    { id: 'vehicle', label: 'Vehicle Loan', icon: Car, type: LoanType.vehicle },
    { id: 'business', label: 'Business Loan', icon: Building2, type: LoanType.business },
    { id: 'home', label: 'Home Loan', icon: Home, type: LoanType.home },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const tenureNum = parseInt(tenure);
    const incomeNum = parseFloat(income);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }

    if (isNaN(tenureNum) || tenureNum <= 0) {
      toast.error('Please enter a valid tenure');
      return;
    }

    if (isNaN(incomeNum) || incomeNum <= 0) {
      toast.error('Please enter a valid income');
      return;
    }

    const currentLoanType = loanTypes.find((t) => t.id === activeTab)?.type;
    if (!currentLoanType) return;

    try {
      await applyLoan.mutateAsync({
        loanType: currentLoanType,
        name: name.trim(),
        amount: BigInt(Math.floor(amountNum * 100)),
        tenure: BigInt(tenureNum),
        income: BigInt(Math.floor(incomeNum * 100)),
        purpose: purpose.trim(),
        documents: documents.trim(),
      });

      toast.success('Loan application submitted successfully');
      setName('');
      setAmount('');
      setTenure('');
      setIncome('');
      setPurpose('');
      setDocuments('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit loan application');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Loan Applications
        </h1>
        <p className="text-muted-foreground">Apply for vehicle, business, or home loans</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {loanTypes.map((loan) => {
            const Icon = loan.icon;
            return (
              <TabsTrigger key={loan.id} value={loan.id} className="gap-2">
                <Icon className="h-4 w-4" />
                {loan.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {loanTypes.map((loan) => (
          <TabsContent key={loan.id} value={loan.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <loan.icon className="h-5 w-5" />
                  {loan.label} Application
                </CardTitle>
                <CardDescription>Fill in the details to apply for a {loan.label.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Loan Amount (USD) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (Months) *</Label>
                      <Input
                        id="tenure"
                        type="number"
                        min="1"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        placeholder="12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="income">Annual Income (USD) *</Label>
                      <Input
                        id="income"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Describe the purpose of this loan"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documents">Documents (Optional)</Label>
                    <Textarea
                      id="documents"
                      value={documents}
                      onChange={(e) => setDocuments(e.target.value)}
                      placeholder="List any supporting documents you can provide"
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={applyLoan.isPending}>
                    {applyLoan.isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* My Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Applications
          </CardTitle>
          <CardDescription>Track your loan application status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading applications..." />
          ) : error ? (
            <ErrorState message="Failed to load applications" onRetry={() => refetch()} />
          ) : !applications || applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Your loan applications will appear here"
            />
          ) : (
            <div className="space-y-3">
              {applications.map((app, index) => {
                const loanInfo = loanTypes.find((t) => t.type === app.loanType);
                const Icon = loanInfo?.icon || Building2;
                return (
                  <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{loanInfo?.label || 'Loan'}</p>
                          <p className="text-sm text-muted-foreground">{app.name}</p>
                        </div>
                      </div>
                      <Badge variant={app.status === Variant_submitted_underReview.submitted ? 'secondary' : 'default'}>
                        {app.status === Variant_submitted_underReview.underReview ? 'Under Review' : 'Submitted'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{formatCurrency(app.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tenure</p>
                        <p className="font-medium">{app.tenure.toString()} months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Income</p>
                        <p className="font-medium">{formatCurrency(app.income)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applied</p>
                        <p className="font-medium">{formatDate(app.timestamp)}</p>
                      </div>
                    </div>
                    {app.purpose && (
                      <p className="text-sm text-muted-foreground italic">{app.purpose}</p>
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
