export type UserRole = "ADMIN" | "MODERATOR" | "SELLER" | "BUYER" | "USER";

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  phoneNumber: string | null;
  location: { lat: number; lng: number } | null;
  address: string | null;
  bio: string | null;
  rating: number | null;
  reviewCount: number;
  stripeAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  productCount?: number;
  reviewsReceived?: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  location?: { lat: number; lng: number };
}
