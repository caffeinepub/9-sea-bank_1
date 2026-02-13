import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetDashboardSummary } from '../hooks/useQueries';
import { LoadingState, EmptyState, ErrorState } from '../components/common/QueryState';
import { ArrowLeftRight, CreditCard, Building2, Receipt, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { formatCurrency, formatDate } from '../utils/finance';

export default function DashboardPage() {
  const { data: summary, isLoading, error, refetch } = useGetDashboardSummary();

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;
  if (error) return <ErrorState message="Failed to load dashboard" onRetry={() => refetch()} />;
  if (!summary) return <EmptyState title="No data available" />;

  const stats = [
    {
      title: 'Recent Transfers',
      value: summary.recentTransfers.length,
      icon: ArrowLeftRight,
      href: '/transfer',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Saved Cards',
      value: Number(summary.cardCount),
      icon: CreditCard,
      href: '/cards',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Loan Applications',
      value: Number(summary.loanCount),
      icon: Building2,
      href: '/loans',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'EMI Plans',
      value: Number(summary.emiPlansCount),
      icon: Receipt,
      href: '/emi',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your financial activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">View details →</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>Your latest money transfer activity</CardDescription>
            </div>
            <Link to="/transfer">
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {summary.recentTransfers.length === 0 ? (
            <EmptyState
              title="No transfers yet"
              description="Start by making your first money transfer"
              action={{
                label: 'Make Transfer',
                onClick: () => {},
              }}
            />
          ) : (
            <div className="space-y-4">
              {summary.recentTransfers.slice(0, 5).map((transfer, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowLeftRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transfer.beneficiary}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transfer.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transfer.amount)}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {transfer.transferType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Access your most used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/transfer">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Transfer Money
              </Button>
            </Link>
            <Link to="/cards">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Manage Cards
              </Button>
            </Link>
            <Link to="/loans">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" />
                Apply for Loan
              </Button>
            </Link>
            <Link to="/emi">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Receipt className="h-4 w-4" />
                EMI Calculator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
