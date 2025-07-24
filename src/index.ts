export interface Supplier {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount?: number;
  city: string;
  county: string;
  logo?: string;
  verified: boolean;
}