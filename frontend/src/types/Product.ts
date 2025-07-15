export interface CostBreakdown {
  item: string;
  cost: number;
}
export interface Product {
  _id: string;
  name: string;
  category: 'military' | 'safety' | 'official';
  material: 'PVC' | 'Rubber' | 'Leather';
  height: 14 | 22;
  eyelets: number;
  imageUrl?: string;
  sellingPrice: { wholesale: number; retail: number };
  baseCost: number;
  materials: CostBreakdown[];
  labour: CostBreakdown[];
}
export type UserRole = 'B2B' | 'B2C';

export type Filters = {
  category?: 'military' | 'safety' | 'official';
  material?: 'PVC' | 'Rubber' | 'Leather';
  height?: 14 | 22;
}; 