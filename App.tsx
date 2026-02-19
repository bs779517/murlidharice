import React, { useState, useEffect } from 'react';
import { 
  Search, Moon, Sun, Lock, ShoppingCart, Loader2, 
  X, Minus, Plus, CheckCircle, XCircle, Star, 
  LogOut, Trash2, ToggleLeft, ToggleRight 
} from 'lucide-react';

// --- TYPES ---
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

// --- CONSTANTS ---
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

// --- STORE ---
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
      try {
        const parsed = JSON.parse(stored);
        setState({
          ...parsed,
          products: parsed.products || INITIAL_PRODUCTS,
          cart: parsed.cart || [],
          orders: parsed.orders || [],
          coupons: parsed.coupons || INITIAL_COUPONS,
        });
      } catch (e) {
        // Fallback if parse fails
        setState(s => ({ ...s, products: INITIAL_PRODUCTS, coupons: INITIAL_COUPONS }));
      }
    } else {
      setState(s => ({
        ...s,
        products: INITIAL_PRODUCTS,
        coupons: INITIAL_COUPONS
      }));
    }
    
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('appState', JSON.stringify(state));
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
    state, loading, toggleTheme, addToCart, updateCartQty, clearCart, 
    applyCoupon, setCategory, addProduct, deleteProduct, toggleProductStock,
    addCoupon, deleteCoupon, addOrder, toggleShop, resetData
  };
}

// --- COMPONENTS ---

// 1. Toast
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border-l-4 animate-[slideUp_0.3s_ease]
      ${type === 'success' 
        ? 'bg-light-card dark:bg-ice-card border-ice-success text-light-text dark:text-white' 
        : 'bg-light-card dark:bg-ice-card border-ice-danger text-light-text dark:text-white'}
    `}>
      {type === 'success' ? <CheckCircle size={18} className="text-ice-success" /> : <XCircle size={18} className="text-ice-danger" />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

// 2. CartModal
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  onUpdateQty: (id: number, delta: number) => void;
  onApplyCoupon: (c: Coupon | null) => void;
  onCheckout: () => void;
}
const CartModal: React.FC<CartModalProps> = ({
  isOpen, onClose, cart, appliedCoupon, coupons, onUpdateQty, onApplyCoupon, onCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') discount = subtotal * (appliedCoupon.value / 100);
    if (appliedCoupon.type === 'flat') discount = appliedCoupon.value;
  }
  const delivery = subtotal >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryCharge;
  const total = subtotal - discount + delivery;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find(c => c.code === code);
    if (found) {
      onApplyCoupon(found);
      setCouponMsg(`Coupon "${code}" applied!`);
    } else {
      setCouponMsg('Invalid coupon code');
      setTimeout(() => setCouponMsg(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-light-card dark:bg-ice-card w-full max-w-[500px] max-h-[90vh] flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 relative">
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-light-card dark:bg-ice-card rounded-t-2xl z-10">
          <h2 className="text-xl font-bold dark:text-white text-gray-800">Your Cart 🛒</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-ice-text2 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-ice-text2">Your cart is empty.</div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10 last:border-0">
                    <div>
                      <div className="font-semibold dark:text-white text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-ice-text2">₹{item.price} x {item.qty}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"><Minus size={14} /></button>
                      <span className="font-medium w-4 text-center dark:text-white">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex gap-2 mb-2">
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Enter Coupon Code" className="flex-1 bg-light-bg dark:bg-ice-bg border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ice-accent dark:text-white" />
                  <button onClick={handleApplyCoupon} className="border border-gray-300 dark:border-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 dark:text-white">Apply</button>
                </div>
                {couponMsg && <div className={`text-xs ${couponMsg.includes('Invalid') ? 'text-ice-danger' : 'text-ice-success'}`}>{couponMsg}</div>}
              </div>
              <div className="bg-light-bg dark:bg-ice-bg p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2 text-sm dark:text-ice-text2"><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discount > 0 && <div className="flex justify-between mb-2 text-sm text-ice-success"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
                <div className="flex justify-between mb-2 text-sm dark:text-ice-text2"><span>Delivery</span><span>₹{delivery}</span></div>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 dark:border-white/10 font-bold text-lg dark:text-white text-gray-900"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
              </div>
              <button onClick={onCheckout} className="w-full bg-gradient-to-r from-ice-accent to-ice-accent2 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Order via WhatsApp 📱</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. ProductModal
interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  shopOpen: boolean;
}
const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, shopOpen }) => {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-light-card dark:bg-ice-card w-full max-w-[400px] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-light-card dark:bg-ice-card">
          <h3 className="text-lg font-bold font-serif dark:text-white text-gray-900">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-ice-text2 dark:hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-4">
          <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-xl mb-4" />
          <p className="text-gray-600 dark:text-ice-text2 mb-4 text-sm">Delicious {product.name} made with fresh ingredients. Perfect for a quick treat!</p>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-ice-accent">₹{product.price}</h2>
            <div className="flex items-center gap-1 text-ice-accent text-sm font-medium"><Star size={16} fill="currentColor" /><span>{product.rating}</span></div>
          </div>
          <button 
            onClick={() => { onAddToCart(product); onClose(); }}
            disabled={!product.inStock || !shopOpen}
            className={`w-full py-3 rounded-lg font-bold transition-all ${(!product.inStock || !shopOpen) ? 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-ice-accent to-ice-accent2 text-black hover:opacity-90 shadow-lg'}`}
          >
            {(!shopOpen) ? 'Shop Closed' : (!product.inStock ? 'Out of Stock' : 'Add to Cart')}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. AdminPanel
interface AdminPanelProps {
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  shopOpen: boolean;
  onLogout: () => void;
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: number) => void;
  onToggleStock: (id: number) => void;
  onAddCoupon: (c: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onToggleShop: () => void;
  onResetData: () => void;
  toast: (msg: string, type: 'success' | 'error') => void;
}
type Tab = 'menu' | 'orders' | 'coupons' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({
  products, coupons, orders, shopOpen, onLogout,
  onAddProduct, onDeleteProduct, onToggleStock,
  onAddCoupon, onDeleteCoupon, onToggleShop, onResetData, toast
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [newProd, setNewProd] = useState({ name: '', price: '', cat: 'Sticks', img: '' });
  const [newCoupon, setNewCoupon] = useState({ code: '', val: '', type: 'percent' as 'percent' | 'flat' });

  const handleAddProduct = () => {
    if (!newProd.name || !newProd.price) return toast("Name and Price required", "error");
    onAddProduct({
      id: Date.now(),
      name: newProd.name,
      price: parseFloat(newProd.price),
      category: newProd.cat,
      image: newProd.img || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      inStock: true,
      rating: 0
    });
    setNewProd({ name: '', price: '', cat: 'Sticks', img: '' });
    toast("Product added", "success");
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.val) return toast("Code and Value required", "error");
    onAddCoupon({
      code: newCoupon.code.toUpperCase(),
      value: parseFloat(newCoupon.val),
      type: newCoupon.type
    });
    setNewCoupon({ code: '', val: '', type: 'percent' });
    toast("Coupon added", "success");
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-ice-bg text-light-text dark:text-white pb-20">
      <nav className="bg-light-card dark:bg-ice-card p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center sticky top-0 z-20">
        <div className="font-serif font-bold text-xl text-ice-accent">Admin Panel</div>
        <button onClick={onLogout} className="flex items-center gap-2 border border-gray-300 dark:border-white/20 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><LogOut size={16} /> Logout</button>
      </nav>
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto border-b border-gray-200 dark:border-white/10 pb-4">
          {['menu', 'orders', 'coupons', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as Tab)} className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-ice-accent text-black border-ice-accent' : 'bg-transparent border-gray-300 dark:border-white/20 dark:text-white text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5'}`}>{tab === 'menu' ? '📋 Menu' : tab === 'orders' ? '📦 Orders' : tab === 'coupons' ? '🎟️ Coupons' : '⚙️ Settings'}</button>
          ))}
        </div>
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-light-card dark:bg-ice-card p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-bold mb-4 text-lg">Add New Product</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="input-field" placeholder="Name" />
                <input type="number" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="input-field" placeholder="Price (₹)" />
                <select value={newProd.cat} onChange={e => setNewProd({...newProd, cat: e.target.value})} className="input-field"><option>Sticks</option><option>Cones</option><option>Family</option></select>
                <input value={newProd.img} onChange={e => setNewProd({...newProd, img: e.target.value})} className="input-field" placeholder="Image URL" />
              </div>
              <button onClick={handleAddProduct} className="mt-4 w-full sm:w-auto px-6 py-2 bg-ice-accent text-black font-semibold rounded-lg hover:brightness-110">Add Product</button>
            </div>
            <h3 className="font-bold text-lg mt-8">Current Products</h3>
            <div className="grid gap-3">
              {products.map(p => (
                <div key={p.id} className="bg-light-card dark:bg-ice-card p-4 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{p.name} <span className="text-gray-500 dark:text-ice-text2 ml-2">₹{p.price}</span></div>
                    <div className={`text-xs mt-1 font-medium ${p.inStock ? 'text-ice-success' : 'text-ice-danger'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onToggleStock(p.id)} className="px-3 py-1.5 text-xs border border-gray-300 dark:border-white/20 rounded hover:bg-gray-100 dark:hover:bg-white/10">Toggle Stock</button>
                    <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-ice-danger bg-ice-danger/10 rounded hover:bg-ice-danger/20"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? <div className="text-center text-gray-500 py-10">No orders yet.</div> :
              [...orders].reverse().map(o => (
                <div key={o.id} className="bg-light-card dark:bg-ice-card p-4 rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="flex justify-between mb-2"><strong className="text-ice-accent">Order #{String(o.id).slice(-4)}</strong><span className="text-xs text-gray-500 dark:text-ice-text2">{o.time}</span></div>
                  <div className="text-sm text-gray-600 dark:text-ice-text2 mb-2">{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</div>
                  <div className="font-bold border-t border-gray-200 dark:border-white/10 pt-2 mt-2">Total: ₹{o.total}</div>
                </div>
              ))
            }
          </div>
        )}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-light-card dark:bg-ice-card p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-bold mb-4 text-lg">Create Coupon</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} className="input-field" placeholder="CODE" />
                <input type="number" value={newCoupon.val} onChange={e => setNewCoupon({...newCoupon, val: e.target.value})} className="input-field" placeholder="Value" />
                <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value as any})} className="input-field"><option value="percent">% Off</option><option value="flat">₹ Flat Off</option></select>
                <button onClick={handleAddCoupon} className="px-6 py-2 bg-ice-accent text-black font-semibold rounded-lg whitespace-nowrap hover:brightness-110">Add</button>
              </div>
            </div>
            <div className="grid gap-3">
              {coupons.map(c => (
                <div key={c.code} className="bg-light-card dark:bg-ice-card p-4 rounded-xl border border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <div><strong className="text-lg">{c.code}</strong><span className="ml-2 text-gray-500 dark:text-ice-text2">{c.value}{c.type === 'percent' ? '%' : '₹'} off</span></div>
                  <button onClick={() => onDeleteCoupon(c.code)} className="p-2 text-ice-danger bg-ice-danger/10 rounded hover:bg-ice-danger/20"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-light-card dark:bg-ice-card p-6 rounded-xl border border-gray-200 dark:border-white/10">
              <h3 className="font-bold text-lg mb-2">Shop Status</h3>
              <p className="text-sm text-gray-500 dark:text-ice-text2 mb-4">Toggle whether the shop is currently open or closed for orders.</p>
              <button onClick={onToggleShop} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${shopOpen ? 'bg-ice-danger/10 text-ice-danger hover:bg-ice-danger/20' : 'bg-ice-success/10 text-ice-success hover:bg-ice-success/20'}`}>{shopOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}{shopOpen ? 'Close Shop' : 'Open Shop'}</button>
            </div>
            <div className="bg-light-card dark:bg-ice-card p-6 rounded-xl border border-gray-200 dark:border-white/10">
              <h3 className="font-bold text-lg mb-2 text-ice-danger">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-ice-text2 mb-4">Permanently clear all products, orders, and settings.</p>
              <button onClick={() => { if(confirm('Are you sure?')) onResetData(); }} className="px-6 py-2 bg-ice-danger text-white rounded-lg hover:bg-red-600 transition-colors">Reset App Data</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .input-field { width: 100%; background: transparent; border: 1px solid #374151; padding: 0.5rem 1rem; border-radius: 0.5rem; color: inherit; }
        .dark .input-field { border-color: rgba(255,255,255,0.2); }
        .input-field:focus { outline: none; border-color: #f7b731; }
      `}</style>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const { 
    state, loading, toggleTheme, addToCart, updateCartQty, clearCart, 
    applyCoupon, setCategory, addProduct, deleteProduct, toggleProductStock,
    addCoupon, deleteCoupon, addOrder, toggleShop, resetData 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  const handleAdminLogin = () => {
    if (adminPass === CONFIG.defaultPassword) {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPass('');
      showToast('Welcome Admin!');
    } else {
      showToast('Incorrect password', 'error');
    }
  };

  const handleCheckout = () => {
    if (!state.shopOpen) return showToast('Shop is closed', 'error');
    
    let text = `*New Order from Murlidhar Icecream* 🍦\n\n`;
    text += `*Items:*\n`;
    state.cart.forEach(item => {
      text += `• ${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
    });
    
    let subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discount = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon.type === 'percent') discount = subtotal * (state.appliedCoupon.value / 100);
      if (state.appliedCoupon.type === 'flat') discount = state.appliedCoupon.value;
    }
    let delivery = subtotal >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryCharge;
    let total = subtotal - discount + delivery; 
    
    text += `\n*Total: ₹${total.toFixed(0)}*\n`;
    text += `Delivery: ₹${delivery}\n`;
    text += `\nPlease confirm my order.`;

    addOrder({
      id: Date.now(),
      items: [...state.cart],
      total: total,
      time: new Date().toLocaleString()
    });

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    clearCart();
    setCartOpen(false);
    showToast('Redirecting to WhatsApp...');
  };

  const filteredProducts = state.products.filter(p => 
    (state.activeCategory === 'All' || p.category === state.activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-ice-bg flex flex-col items-center justify-center text-white z-50">
        <div className="spinner w-12 h-12 border-4 border-ice-card border-t-ice-accent rounded-full"></div>
        <p className="mt-4 font-semibold animate-pulse">Loading Flavors...</p>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <>
        <AdminPanel 
          products={state.products}
          coupons={state.coupons}
          orders={state.orders}
          shopOpen={state.shopOpen}
          onLogout={() => setIsAdminLoggedIn(false)}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
          onToggleStock={toggleProductStock}
          onAddCoupon={addCoupon}
          onDeleteCoupon={deleteCoupon}
          onToggleShop={toggleShop}
          onResetData={resetData}
          toast={showToast}
        />
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300]">
          {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative">
      <header className="sticky top-0 z-40 bg-light-card/90 dark:bg-ice-card/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 py-3">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-serif text-xl font-bold bg-gradient-to-br from-ice-accent to-ice-accent2 bg-clip-text text-transparent cursor-pointer" onClick={() => window.location.reload()}>🍦 Murlidhar Icecream</div>
          <div className="flex-1 max-w-[300px] relative">
            <input type="text" placeholder="Search flavors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-full bg-light-bg dark:bg-ice-bg border border-gray-300 dark:border-white/10 text-sm focus:outline-none focus:border-ice-accent dark:text-white" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${state.shopOpen ? 'bg-ice-success/20 text-ice-success' : 'bg-ice-danger/20 text-ice-danger'}`}>{state.shopOpen ? 'Open' : 'Closed'}</div>
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 flex items-center justify-center hover:bg-ice-accent hover:text-black hover:border-ice-accent transition-all dark:text-white text-gray-700">{state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowAdminLogin(true)} className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 flex items-center justify-center hover:bg-ice-accent hover:text-black hover:border-ice-accent transition-all dark:text-white text-gray-700"><Lock size={18} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4">
        <section className="text-center py-8">
          <h1 className="font-serif text-3xl md:text-4xl mb-2 dark:text-white text-gray-900">Cool & Creamy Delights</h1>
          <p className="text-gray-500 dark:text-ice-text2 mb-6">Handcrafted with love. Taste the happiness.</p>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            <div className="min-w-[280px] bg-light-card dark:bg-ice-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 snap-start cursor-pointer hover:-translate-y-1 transition-transform group" onClick={() => { navigator.clipboard.writeText('SWEET10'); showToast('Code "SWEET10" copied!'); }}>
              <span className="bg-ice-danger text-white px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">LIMITED TIME</span>
              <div className="font-bold text-lg mb-1 dark:text-white text-gray-800 group-hover:text-ice-accent transition-colors">🎉 10% Off First Order</div>
              <div className="text-sm text-gray-500 dark:text-ice-text2">Use code: <strong className="text-ice-accent">SWEET10</strong></div>
            </div>
            <div className="min-w-[280px] bg-light-card dark:bg-ice-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 snap-start cursor-pointer hover:-translate-y-1 transition-transform group" onClick={() => { navigator.clipboard.writeText('FAMILY50'); showToast('Code "FAMILY50" copied!'); }}>
              <span className="bg-ice-danger text-white px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">POPULAR</span>
              <div className="font-bold text-lg mb-1 dark:text-white text-gray-800 group-hover:text-ice-accent transition-colors">Buy 1 Get 1 Free</div>
              <div className="text-sm text-gray-500 dark:text-ice-text2">On Family Packs today!</div>
            </div>
             <div className="min-w-[280px] bg-light-card dark:bg-ice-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 snap-start cursor-pointer hover:-translate-y-1 transition-transform">
              <span className="bg-ice-danger text-white px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">WEEKEND</span>
              <div className="font-bold text-lg mb-1 dark:text-white text-gray-800">Free Delivery</div>
              <div className="text-sm text-gray-500 dark:text-ice-text2">On orders above ₹500</div>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-6 mb-2 hide-scrollbar">
          {['All', 'Sticks', 'Cones', 'Family'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${state.activeCategory === cat ? 'bg-gradient-to-r from-ice-accent to-ice-accent2 text-black border-transparent shadow-lg shadow-ice-accent/20' : 'bg-light-card dark:bg-ice-card border-gray-300 dark:border-white/20 dark:text-white text-gray-700 hover:border-ice-accent'}`}>{cat === 'Family' ? 'Family Packs' : cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-ice-text2">No products found matching your criteria.</div>
          ) : (
            filteredProducts.map(p => (
              <div key={p.id} className="bg-light-card dark:bg-ice-card rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group relative">
                {!p.inStock && <span className="absolute top-3 left-3 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded">Sold Out</span>}
                <div className="h-48 overflow-hidden cursor-pointer" onClick={() => setActiveProduct(p)}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="font-semibold mb-1 dark:text-white text-gray-900">{p.name}</div>
                  <div className="text-xs text-ice-accent mb-2">★ {p.rating}</div>
                  <div className="font-bold text-lg dark:text-ice-accent text-ice-accent mb-3">₹{p.price}</div>
                  <button onClick={() => { if (!state.shopOpen) return showToast('Shop is closed', 'error'); if (!p.inStock) return; addToCart(p); showToast(`${p.name} added!`); }} disabled={!p.inStock || !state.shopOpen} className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${(!p.inStock || !state.shopOpen) ? 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-ice-accent to-ice-accent2 text-black hover:opacity-90 active:scale-95'}`}>{!state.shopOpen ? 'Shop Closed' : (!p.inStock ? 'Out of Stock' : 'Add to Cart')}</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <footer className="text-center py-10 mt-10 border-t border-gray-200 dark:border-white/10 text-gray-500 dark:text-ice-text2 text-sm">
          <p>© {new Date().getFullYear()} Murlidhar Icecream. All rights reserved.</p>
        </footer>
      </main>

      <button onClick={() => setCartOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-ice-accent text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-30 group">
        <ShoppingCart size={28} />
        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-ice-danger text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-ice-bg">{cartCount}</span>}
      </button>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-ice-card p-6 rounded-2xl w-full max-w-sm border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg dark:text-white text-gray-900">Admin Login</h3><button onClick={() => setShowAdminLogin(false)} className="text-gray-500 hover:text-gray-800 dark:text-ice-text2 dark:hover:text-white"><Lock size={20}/></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-500 dark:text-ice-text2 mb-1">Password</label><input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Enter admin password" className="w-full bg-light-bg dark:bg-ice-bg border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-ice-accent dark:text-white" /></div>
              <button onClick={handleAdminLogin} className="w-full bg-ice-accent text-black font-bold py-2 rounded-lg hover:opacity-90">Login</button>
            </div>
          </div>
        </div>
      )}

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={state.cart} appliedCoupon={state.appliedCoupon} coupons={state.coupons} onUpdateQty={updateCartQty} onApplyCoupon={applyCoupon} onCheckout={handleCheckout} />
      <ProductModal product={activeProduct} isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} onAddToCart={(p) => { addToCart(p); showToast(`${p.name} added!`); }} shopOpen={state.shopOpen} />

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-max max-w-[90vw]">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

export default App;