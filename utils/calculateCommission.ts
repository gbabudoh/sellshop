const COMMISSION_RATE = 0.08;

export function calculateCommission(price: number, rate: number = COMMISSION_RATE): number {
  return Math.round(price * rate * 100) / 100;
}

export function calculateSellerEarnings(price: number, rate: number = COMMISSION_RATE): number {
  return Math.round((price - calculateCommission(price, rate)) * 100) / 100;
}

export function getCommissionRate(): number {
  return COMMISSION_RATE;
}
