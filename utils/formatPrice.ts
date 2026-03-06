export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function calculateCommission(price: number, rate: number = 0.08): number {
  return price * rate;
}

export function calculateSellerEarnings(price: number, rate: number = 0.08): number {
  return price - calculateCommission(price, rate);
}
