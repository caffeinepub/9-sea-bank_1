import { Link, useRouterState } from '@tanstack/react-router';
import { Home, ArrowLeftRight, CreditCard, Calculator, Building2, Shield, Receipt, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './Auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Transfer', href: '/transfer', icon: ArrowLeftRight },
    { name: 'Cards', href: '/cards', icon: CreditCard },
    { name: 'Compound Interest', href: '/compound-interest', icon: Calculator },
    { name: 'Loans', href: '/loans', icon: Building2 },
    { name: 'Insurance', href: '/insurance', icon: Shield },
    { name: 'EMI Calculator', href: '/emi', icon: Receipt },
  ];

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/assets/generated/9-sea-bank-logo.dim_512x512.png" 
                  alt="9 Sea Bank" 
                  className="h-10 w-10 transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  9 Sea Bank
                </span>
                <span className="text-xs text-muted-foreground">Your Financial Partner</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {identity && userProfile && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{userProfile.name}</span>
                </div>
              )}
              <LoginButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-accent"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} 9 Sea Bank. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <span className="text-red-500">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
