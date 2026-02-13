import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Card {
    nickname: string;
    cardType: CardType;
    last4: string;
    issuer: string;
    expiry: string;
}
export type Time = bigint;
export interface EmiPlan {
    emi: number;
    principal: Amount;
    createdAt: Time;
    rate: number;
    totalInterest: number;
    tenureMonths: bigint;
    totalPayment: number;
}
export type Amount = bigint;
export type AccountLabel = string;
export interface InsuranceInquiry {
    status: Variant_submitted_reviewed;
    notes: string;
    timestamp: Time;
    category: InsuranceCategory;
    coverageAmount: Amount;
    contactPreference: string;
}
export interface MoneyTransfer {
    status: TransferStatus;
    transferType: TransferType;
    fromAccount: AccountLabel;
    beneficiary: string;
    note: string;
    timestamp: Time;
    amount: Amount;
}
export interface LoanApplication {
    status: Variant_submitted_underReview;
    documents: string;
    name: string;
    loanType: LoanType;
    income: Amount;
    timestamp: Time;
    tenure: bigint;
    amount: Amount;
    purpose: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum CardType {
    credit = "credit",
    debit = "debit"
}
export enum InsuranceCategory {
    home = "home",
    life = "life",
    vehicle = "vehicle",
    health = "health"
}
export enum LoanType {
    home = "home",
    business = "business",
    vehicle = "vehicle"
}
export enum TransferStatus {
    submitted = "submitted",
    completed = "completed",
    failed = "failed"
}
export enum TransferType {
    imps = "imps",
    neft = "neft",
    rtgs = "rtgs"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_submitted_reviewed {
    submitted = "submitted",
    reviewed = "reviewed"
}
export enum Variant_submitted_underReview {
    submitted = "submitted",
    underReview = "underReview"
}
export interface backendInterface {
    addCard(nickname: string, cardType: CardType, issuer: string, last4: string, expiry: string): Promise<void>;
    applyLoan(loanType: LoanType, name: string, amount: Amount, tenure: bigint, income: Amount, purpose: string, documents: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTransfer(fromAccount: AccountLabel, beneficiary: string, amount: Amount, note: string, transferType: TransferType): Promise<void>;
    getAllCards(): Promise<Array<Card>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardSummary(): Promise<{
        loanCount: bigint;
        recentTransfers: Array<MoneyTransfer>;
        cardCount: bigint;
        emiPlansCount: bigint;
    }>;
    getEmiPlans(): Promise<Array<EmiPlan>>;
    getInsuranceInquiries(): Promise<Array<InsuranceInquiry>>;
    getLoanApplications(): Promise<Array<LoanApplication>>;
    getTransferHistory(): Promise<Array<MoneyTransfer>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeCard(nickname: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEmiPlan(principal: Amount, rate: number, tenureMonths: bigint, emi: number, totalPayment: number, totalInterest: number): Promise<void>;
    submitInsuranceInquiry(category: InsuranceCategory, coverageAmount: Amount, notes: string, contactPreference: string): Promise<void>;
}
