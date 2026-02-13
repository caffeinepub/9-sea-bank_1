import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllCards, useAddCard, useRemoveCard } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { CardType } from '../backend';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function CardsPage() {
  const { data: cards, isLoading, error, refetch } = useGetAllCards();
  const addCard = useAddCard();
  const removeCard = useRemoveCard();

  const [nickname, setNickname] = useState('');
  const [cardType, setCardType] = useState<CardType>(CardType.debit);
  const [issuer, setIssuer] = useState('');
  const [last4, setLast4] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(last4)) {
      toast.error('Last 4 digits must be exactly 4 numbers');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error('Expiry must be in MM/YY format');
      return;
    }

    try {
      await addCard.mutateAsync({
        nickname: nickname.trim(),
        cardType,
        issuer: issuer.trim(),
        last4,
        expiry,
      });

      toast.success('Card added successfully');
      setNickname('');
      setIssuer('');
      setLast4('');
      setExpiry('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add card');
    }
  };

  const handleDelete = async () => {
    if (!cardToDelete) return;

    try {
      await removeCard.mutateAsync(cardToDelete);
      toast.success('Card removed successfully');
      setCardToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove card');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Card Management
        </h1>
        <p className="text-muted-foreground">Manage your debit and credit cards</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Card Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Card
            </CardTitle>
            <CardDescription>Register a new debit or credit card</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Card Nickname *</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g., Personal Visa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type *</Label>
                <Select
                  value={cardType}
                  onValueChange={(value) => setCardType(value as CardType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CardType.debit}>Debit Card</SelectItem>
                    <SelectItem value={CardType.credit}>Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Card Issuer *</Label>
                <Input
                  id="issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g., Visa, Mastercard"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last4">Last 4 Digits *</Label>
                <Input
                  id="last4"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  maxLength={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date (MM/YY) *</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setExpiry(value);
                  }}
                  placeholder="12/25"
                  maxLength={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={addCard.isPending}>
                {addCard.isPending ? 'Adding...' : 'Add Card'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cards List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Cards</CardTitle>
            <CardDescription>Manage your saved cards</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading cards..." />
            ) : error ? (
              <ErrorState message="Failed to load cards" onRetry={() => refetch()} />
            ) : !cards || cards.length === 0 ? (
              <EmptyState
                title="No cards yet"
                description="Add your first card to get started"
              />
            ) : (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.nickname}
                    className="p-4 rounded-lg border bg-gradient-to-br from-card to-accent/5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{card.nickname}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {card.cardType} • {card.issuer}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCardToDelete(card.nickname)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">•••• {card.last4}</span>
                      <span className="text-muted-foreground">Exp: {card.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!cardToDelete} onOpenChange={() => setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
