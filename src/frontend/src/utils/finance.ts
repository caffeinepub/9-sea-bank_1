// Compound Interest Calculation
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number,
  frequency: number,
  monthlyContribution: number = 0
): { futureValue: number; totalInterest: number; totalContributions: number } {
  const r = rate / 100;
  const n = frequency;
  const t = years;

  // Future value of principal with compound interest
  const fvPrincipal = principal * Math.pow(1 + r / n, n * t);

  // Future value of monthly contributions (annuity)
  let fvContributions = 0;
  if (monthlyContribution > 0) {
    const monthlyRate = r / 12;
    const months = years * 12;
    fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  const futureValue = fvPrincipal + fvContributions;
  const totalContributions = monthlyContribution * years * 12;
  const totalInterest = futureValue - principal - totalContributions;

  return {
    futureValue,
    totalInterest,
    totalContributions,
  };
}

// EMI Calculation
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): { emi: number; totalPayment: number; totalInterest: number } {
  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: isFinite(emi) ? emi : 0,
    totalPayment: isFinite(totalPayment) ? totalPayment : 0,
    totalInterest: isFinite(totalInterest) ? totalInterest : 0,
  };
}

// Format currency
export function formatCurrency(amount: number | bigint): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Format number with commas
export function formatNumber(num: number | bigint): string {
  const value = typeof num === 'bigint' ? Number(num) : num;
  return new Intl.NumberFormat('en-US').format(value);
}

// Format date
export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
