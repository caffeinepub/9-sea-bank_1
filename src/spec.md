# Specification

## Summary
**Goal:** Build the “9 Sea Bank” net banking web app with consistent navigation/theme, Internet Identity authentication, and core feature pages for transfers, cards, interest, loans, insurance, and EMI with user-scoped persistence.

**Planned changes:**
- Create the core frontend app shell with “9 Sea Bank” branding and navigation to Dashboard, Money Transfer, Cards, Compound Interest, Loans (Vehicle/Business/Home), Insurance, and EMI.
- Apply a coherent visual theme (colors, typography, spacing, and component styling) across all pages.
- Add Internet Identity sign-in/out and protect all banking feature pages behind authentication.
- Implement a single Motoko backend actor with per-user (Principal-keyed) persistence for payees/beneficiaries, transfers, cards, loan applications, insurance inquiries, and (optionally) saved EMI plans.
- Money Transfer: transfer form with validation, submit to backend, and transfer history list with status.
- Cards: add/list/remove debit and credit cards using safe display fields (nickname, type, last-4, expiry) with validation and persistence.
- Compound Interest: calculator UI with validation and results (future value, total interest).
- Loans: three application forms (Vehicle/Business/Home) with validation, submit to backend, and “My Applications” list with statuses.
- Insurance: browse categories and submit insurance inquiry form to backend; list submitted inquiries with status.
- EMI: EMI calculator with validation and outputs (EMI, total payment, total interest) and optionally save/list EMI plans.
- Dashboard: overview widgets for recent transfers, saved cards count, active loan applications count, and saved EMI plans (if implemented), with quick links.
- Use React Query for all backend list/create/delete interactions, including loading, empty, and error states.

**User-visible outcome:** Users can sign in with Internet Identity to access a themed “9 Sea Bank” app where they can submit and view transfers, manage cards, calculate compound interest and EMI, submit loan applications and insurance inquiries, and see an at-a-glance dashboard summary of their saved data.
