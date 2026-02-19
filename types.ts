export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  time: string;
}

export interface AppState {
  theme: 'dark' | 'light';
  shopOpen: boolean;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  activeCategory: string;
}

export type Theme = 'dark' | 'light';