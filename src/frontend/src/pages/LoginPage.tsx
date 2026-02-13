import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, TrendingUp, CreditCard, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const features = [
    {
      icon: Shield,
      title: 'Secure Banking',
      description: 'Bank-grade security with Internet Identity authentication',
    },
    {
      icon: TrendingUp,
      title: 'Smart Investments',
      description: 'Compound interest calculators and financial planning tools',
    },
    {
      icon: CreditCard,
      title: 'Card Management',
      description: 'Manage your debit and credit cards in one place',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is encrypted and stored securely on the blockchain',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/9-sea-bank-logo.dim_512x512.png" 
                alt="9 Sea Bank" 
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  9 Sea Bank
                </span>
                <span className="text-xs text-muted-foreground">Your Financial Partner</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to the Future of{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Banking
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Experience secure, decentralized banking with 9 Sea Bank. Manage your finances, apply for loans, 
                and plan your future with our comprehensive suite of financial tools.
              </p>
            </div>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle>Get Started Today</CardTitle>
                <CardDescription>
                  Sign in securely with Internet Identity to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={login} 
                  disabled={loginStatus === 'logging-in'}
                  size="lg"
                  className="w-full"
                >
                  {loginStatus === 'logging-in' ? 'Connecting...' : 'Sign In with Internet Identity'}
                </Button>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/assets/generated/9-sea-bank-hero.dim_1600x600.png" 
                alt="9 Sea Bank Platform" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
