import { Product, Coupon } from './types';

export const CONFIG = {
  whatsappNumber: '918218377572',
  defaultPassword: 'admin123',
  minOrder: 200,
  deliveryCharge: 50,
  freeDeliveryAbove: 500
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Chocolate Stick', price: 30, category: 'Sticks', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', inStock: true, rating: 4.8 },
  { id: 2, name: 'Vanilla Cone', price: 40, category: 'Cones', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', inStock: true, rating: 4.5 },
  { id: 3, name: 'Strawberry Stick', price: 35, category: 'Sticks', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', inStock: true, rating: 4.7 },
  { id: 4, name: 'Family Pack', price: 250, category: 'Family', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', inStock: true, rating: 4.6 },
  { id: 5, name: 'Mango Cone', price: 45, category: 'Cones', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', inStock: false, rating: 4.4 }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'SWEET10', type: 'percent', value: 10 },
  { code: 'FAMILY50', type: 'flat', value: 50 }
];