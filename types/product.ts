export type ProductCondition = "NEW" | "USED_LIKE_NEW" | "USED_GOOD" | "USED_FAIR" | "FOR_PARTS";
export type ProductStatus = "DRAFT" | "ACTIVE" | "SOLD" | "INACTIVE" | "FLAGGED";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  status: ProductStatus;
  location: { lat: number; lng: number } | null;
  address: string | null;
  images: string[];
  isNegotiable: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
}

export interface ProductWithSeller extends Product {
  seller: {
    id: string;
    name: string | null;
    image: string | null;
    rating: number | null;
    reviewCount: number;
  };
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  address: string;
  location?: { lat: number; lng: number };
  images: string[];
  isNegotiable?: boolean;
}
