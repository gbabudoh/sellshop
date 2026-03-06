export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "DISPUTED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED" | "DISPUTED";

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  commission: number;
  sellerEarnings: number;
  paymentIntentId: string | null;
  paymentStatus: PaymentStatus;
  buyerAddress: any | null;
  meetingDetails: any | null;
  meetingTime: Date | null;
  meetingLocation: string | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  buyerId: string;
  sellerId: string;
}

export interface CreateOrderInput {
  productId: string;
  meetingLocation: string;
  meetingTime: Date;
}
