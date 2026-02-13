import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGetEmiPlans, useSaveEmiPlan } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { Receipt, Calculator, Save } from 'lucide-react';
import { calculateEMI, formatCurrency, formatDate } from '../utils/finance';
import { toast } from 'sonner';

export default function EmiPage() {
  const { data: plans, isLoading, error, refetch } = useGetEmiPlans();
  const savePlan = useSaveEmiPlan();

  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('60');
  const [isAnnualRate, setIsAnnualRate] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof calculateEMI> | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseInt(tenure) || 0;

    if (p <= 0 || r < 0 || t <= 0) {
      toast.error('Please enter valid values');
      return;
    }

    const annualRate = isAnnualRate ? r : r * 12;
    const calculated = calculateEMI(p, annualRate, t);
    setResult(calculated);
  };

  const handleSave = async () => {
    if (!result) {
      toast.error('Please calculate EMI first');
      return;
    }

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseInt(tenure);

    try {
      await savePlan.mutateAsync({
        principal: BigInt(Math.floor(p * 100)),
        rate: isAnnualRate ? r : r * 12,
        tenureMonths: BigInt(t),
        emi: result.emi,
        totalPayment: result.totalPayment,
        totalInterest: result.totalInterest,
      });

      toast.success('EMI plan saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save EMI plan');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Receipt className="h-8 w-8" />
          EMI Calculator
        </h1>
        <p className="text-muted-foreground">Calculate your Equated Monthly Installment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Details
            </CardTitle>
            <CardDescription>Enter your loan parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Loan Amount ($)</Label>
              <Input
                id="principal"
                type="number"
                step="0.01"
                min="0"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  id="rateType"
                  checked={isAnnualRate}
                  onCheckedChange={setIsAnnualRate}
                />
                <Label htmlFor="rateType" className="text-sm text-muted-foreground cursor-pointer">
                  {isAnnualRate ? 'Annual Rate' : 'Monthly Rate'}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (Months)</Label>
              <Input
                id="tenure"
                type="number"
                min="1"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1">
                Calculate EMI
              </Button>
              {result && (
                <Button onClick={handleSave} variant="outline" disabled={savePlan.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
          <CardHeader>
            <CardTitle>EMI Breakdown</CardTitle>
            <CardDescription>Your monthly payment details</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Monthly EMI</p>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(result.emi)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalPayment)}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-background border">
                    <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                    <p className="text-xl font-semibold text-orange-600">{formatCurrency(result.totalInterest)}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold">Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal Amount:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="font-medium">{rate}% {isAnnualRate ? 'p.a.' : 'p.m.'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenure:</span>
                      <span className="font-medium">{tenure} months</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Interest Paid:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(result.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Enter loan details and click Calculate to see your EMI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Saved EMI Plans</CardTitle>
          <CardDescription>Your saved loan calculations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading plans..." />
          ) : error ? (
            <ErrorState message="Failed to load plans" onRetry={() => refetch()} />
          ) : !plans || plans.length === 0 ? (
            <EmptyState
              title="No saved plans"
              description="Save your EMI calculations for future reference"
            />
          ) : (
            <div className="space-y-3">
              {plans.map((plan, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">EMI: {formatCurrency(plan.emi)}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(plan.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Principal</p>
                      <p className="font-medium">{formatCurrency(plan.principal)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-medium">{plan.rate.toFixed(2)}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tenure</p>
                      <p className="font-medium">{plan.tenureMonths.toString()} months</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Interest</p>
                      <p className="font-medium text-orange-600">{formatCurrency(plan.totalInterest)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
