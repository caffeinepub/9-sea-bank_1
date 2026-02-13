import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MoneyTransferPage from './pages/MoneyTransferPage';
import CardsPage from './pages/CardsPage';
import CompoundInterestPage from './pages/CompoundInterestPage';
import LoansPage from './pages/LoansPage';
import InsurancePage from './pages/InsurancePage';
import EmiPage from './pages/EmiPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupDialog from './components/Auth/ProfileSetupDialog';

function RootLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ProfileSetupDialog />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const transferRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfer',
  component: MoneyTransferPage,
});

const cardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cards',
  component: CardsPage,
});

const compoundInterestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compound-interest',
  component: CompoundInterestPage,
});

const loansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loans',
  component: LoansPage,
});

const insuranceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insurance',
  component: InsurancePage,
});

const emiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emi',
  component: EmiPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  transferRoute,
  cardsRoute,
  compoundInterestRoute,
  loansRoute,
  insuranceRoute,
  emiRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
