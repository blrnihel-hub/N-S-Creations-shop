export interface Product {
  id: string;
  name: string;
  description: string;
  localizedName?: Record<string, string>;
  localizedDescription?: Record<string, string>;
  price: number;
  image: string;
  category: string;
  subCategory?: string;
  colors?: string[];
  colorImages?: Record<string, string[]>;
  measure?: string;
  age?: string;
  isSoldOut?: boolean;
  availableDimensions?: string[];
  requiresCustomDimensions?: boolean;
  requiresDescription?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedDimension?: string;
  customDimensions?: string;
  customDescription?: string;
}
