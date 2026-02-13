import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp } from 'lucide-react';
import { calculateCompoundInterest, formatCurrency, formatNumber } from '../utils/finance';

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [frequency, setFrequency] = useState('12');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [result, setResult] = useState<ReturnType<typeof calculateCompoundInterest> | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const y = parseFloat(years) || 0;
    const f = parseInt(frequency) || 1;
    const mc = parseFloat(monthlyContribution) || 0;

    if (p <= 0 || r < 0 || y <= 0) {
      return;
    }

    const calculated = calculateCompoundInterest(p, r, y, f, mc);
    setResult(calculated);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Compound Interest Calculator
        </h1>
        <p className="text-muted-foreground">Calculate the future value of your investments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Initial Principal ($)</Label>
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
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Investment Period (Years)</Label>
              <Input
                id="years"
                type="number"
                step="1"
                min="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Compounding Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annually</SelectItem>
                  <SelectItem value="2">Semi-Annually</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="365">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                min="0"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>

            <Button onClick={handleCalculate} className="w-full">
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Results
            </CardTitle>
            <CardDescription>Your investment growth projection</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <p className="text-sm text-muted-foreground mb-1">Future Value</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(result.futureValue)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                      <p className="text-xl font-semibold text-green-600">{formatCurrency(result.totalInterest)}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground mb-1">Total Contributions</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.totalContributions)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold">Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Principal:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Contributions:</span>
                      <span className="font-medium">{formatCurrency(result.totalContributions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Earned:</span>
                      <span className="font-medium text-green-600">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Total Value:</span>
                      <span className="text-primary">{formatCurrency(result.futureValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Enter your investment details and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
