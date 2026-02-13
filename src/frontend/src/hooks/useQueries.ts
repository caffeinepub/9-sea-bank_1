import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  MoneyTransfer, 
  Card, 
  CardType, 
  TransferType,
  LoanApplication,
  LoanType,
  InsuranceInquiry,
  InsuranceCategory,
  EmiPlan,
  Amount
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Transfer Queries
export function useGetTransferHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<MoneyTransfer[]>({
    queryKey: ['transfers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransferHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fromAccount: string;
      beneficiary: string;
      amount: Amount;
      note: string;
      transferType: TransferType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTransfer(
        data.fromAccount,
        data.beneficiary,
        data.amount,
        data.note,
        data.transferType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Card Queries
export function useGetAllCards() {
  const { actor, isFetching } = useActor();

  return useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nickname: string;
      cardType: CardType;
      issuer: string;
      last4: string;
      expiry: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCard(
        data.nickname,
        data.cardType,
        data.issuer,
        data.last4,
        data.expiry
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRemoveCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nickname: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeCard(nickname);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Loan Queries
export function useGetLoanApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<LoanApplication[]>({
    queryKey: ['loans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoanApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyLoan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      loanType: LoanType;
      name: string;
      amount: Amount;
      tenure: bigint;
      income: Amount;
      purpose: string;
      documents: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyLoan(
        data.loanType,
        data.name,
        data.amount,
        data.tenure,
        data.income,
        data.purpose,
        data.documents
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Insurance Queries
export function useGetInsuranceInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<InsuranceInquiry[]>({
    queryKey: ['insurance'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInsuranceInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInsuranceInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      category: InsuranceCategory;
      coverageAmount: Amount;
      notes: string;
      contactPreference: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInsuranceInquiry(
        data.category,
        data.coverageAmount,
        data.notes,
        data.contactPreference
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance'] });
    },
  });
}

// EMI Queries
export function useGetEmiPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<EmiPlan[]>({
    queryKey: ['emiPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmiPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveEmiPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      principal: Amount;
      rate: number;
      tenureMonths: bigint;
      emi: number;
      totalPayment: number;
      totalInterest: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveEmiPlan(
        data.principal,
        data.rate,
        data.tenureMonths,
        data.emi,
        data.totalPayment,
        data.totalInterest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emiPlans'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Dashboard Query
export function useGetDashboardSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching,
  });
}
