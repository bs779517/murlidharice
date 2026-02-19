import { useState, useEffect } from 'react';
import { AppState, Product, CartItem, Coupon, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../constants';

// Hook to manage global application state
export function useStore() {
  const [state, setState] = useState<AppState>({
    theme: 'dark',
    shopOpen: true,
    products: [],
    cart: [],
    orders: [],
    coupons: [],
    appliedCoupon: null,
    activeCategory: 'All',
  });

  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('appState');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure arrays exist in case of old/corrupt data
      setState({
        ...parsed,
        products: parsed.products || INITIAL_PRODUCTS,
        cart: parsed.cart || [],
        orders: parsed.orders || [],
        coupons: parsed.coupons || INITIAL_COUPONS,
      });
    } else {
      setState(s => ({
        ...s,
        products: INITIAL_PRODUCTS,
        coupons: INITIAL_COUPONS
      }));
    }
    
    // Simulate loader
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Sync to LocalStorage whenever state changes (excluding activeCategory which is ephemeral usually, but original kept it)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('appState', JSON.stringify(state));
      // Apply theme
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [state, loading]);

  // Actions
  const toggleTheme = () => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  
  const addToCart = (product: Product) => {
    setState(s => {
      const existing = s.cart.find(i => i.id === product.id);
      let newCart;
      if (existing) {
        newCart = s.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      } else {
        newCart = [...s.cart, { id: product.id, name: product.name, price: product.price, qty: 1 }];
      }
      return { ...s, cart: newCart };
    });
  };

  const updateCartQty = (id: number, delta: number) => {
    setState(s => {
      const newCart = s.cart.map(item => {
        if (item.id === id) return { ...item, qty: item.qty + delta };
        return item;
      }).filter(item => item.qty > 0);
      return { ...s, cart: newCart };
    });
  };

  const clearCart = () => setState(s => ({ ...s, cart: [], appliedCoupon: null }));

  const applyCoupon = (coupon: Coupon | null) => setState(s => ({ ...s, appliedCoupon: coupon }));

  const setCategory = (cat: string) => setState(s => ({ ...s, activeCategory: cat }));

  // Admin Actions
  const addProduct = (p: Product) => setState(s => ({ ...s, products: [...s.products, p] }));
  const deleteProduct = (id: number) => setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
  const toggleProductStock = (id: number) => setState(s => ({
    ...s,
    products: s.products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
  }));

  const addCoupon = (c: Coupon) => setState(s => ({ ...s, coupons: [...s.coupons, c] }));
  const deleteCoupon = (code: string) => setState(s => ({ ...s, coupons: s.coupons.filter(c => c.code !== code) }));

  const addOrder = (o: Order) => setState(s => ({ ...s, orders: [...s.orders, o] }));
  
  const toggleShop = () => setState(s => ({ ...s, shopOpen: !s.shopOpen }));

  const resetData = () => {
    localStorage.removeItem('appState');
    window.location.reload();
  };

  return {
    state,
    loading,
    toggleTheme,
    addToCart,
    updateCartQty,
    clearCart,
    applyCoupon,
    setCategory,
    addProduct,
    deleteProduct,
    toggleProductStock,
    addCoupon,
    deleteCoupon,
    addOrder,
    toggleShop,
    resetData
  };
}