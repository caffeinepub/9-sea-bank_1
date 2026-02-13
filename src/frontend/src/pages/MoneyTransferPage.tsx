import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetTransferHistory, useCreateTransfer } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '../utils/finance';
import { ArrowLeftRight, Send, History } from 'lucide-react';
import { TransferType, TransferStatus } from '../backend';
import { toast } from 'sonner';

export default function MoneyTransferPage() {
  const { data: transfers, isLoading, error, refetch } = useGetTransferHistory();
  const createTransfer = useCreateTransfer();

  const [fromAccount, setFromAccount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferType, setTransferType] = useState<TransferType>(TransferType.imps);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!fromAccount.trim() || !beneficiary.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTransfer.mutateAsync({
        fromAccount: fromAccount.trim(),
        beneficiary: beneficiary.trim(),
        amount: BigInt(Math.floor(amountNum * 100)),
        note: note.trim(),
        transferType,
      });

      toast.success('Transfer submitted successfully');
      setFromAccount('');
      setBeneficiary('');
      setAmount('');
      setNote('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create transfer');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeftRight className="h-8 w-8" />
          Money Transfer
        </h1>
        <p className="text-muted-foreground">Send money securely to beneficiaries</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              New Transfer
            </CardTitle>
            <CardDescription>Fill in the details to initiate a transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account *</Label>
                <Input
                  id="fromAccount"
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  placeholder="e.g., Savings Account"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary Name *</Label>
                <Input
                  id="beneficiary"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  placeholder="Enter beneficiary name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD) *</Label>
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
                <Label htmlFor="transferType">Transfer Type *</Label>
                <Select
                  value={transferType}
                  onValueChange={(value) => setTransferType(value as TransferType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransferType.imps}>IMPS (Immediate)</SelectItem>
                    <SelectItem value={TransferType.neft}>NEFT (Within 2 hours)</SelectItem>
                    <SelectItem value={TransferType.rtgs}>RTGS (Real Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this transfer"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createTransfer.isPending}>
                {createTransfer.isPending ? 'Processing...' : 'Submit Transfer'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transfer History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transfer History
            </CardTitle>
            <CardDescription>Your recent transfer activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading transfers..." />
            ) : error ? (
              <ErrorState message="Failed to load transfers" onRetry={() => refetch()} />
            ) : !transfers || transfers.length === 0 ? (
              <EmptyState
                title="No transfers yet"
                description="Your transfer history will appear here"
              />
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {transfers.map((transfer, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{transfer.beneficiary}</p>
                        <p className="text-sm text-muted-foreground">{transfer.fromAccount}</p>
                      </div>
                      <Badge variant={transfer.status === TransferStatus.completed ? 'default' : 'secondary'}>
                        {transfer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{formatDate(transfer.timestamp)}</span>
                      <span className="font-semibold">{formatCurrency(transfer.amount)}</span>
                    </div>
                    {transfer.note && (
                      <p className="text-xs text-muted-foreground italic">{transfer.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
