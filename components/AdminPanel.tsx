import React, { useState } from 'react';
import { LogOut, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Product, Coupon, Order } from '../types';

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

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products, coupons, orders, shopOpen, onLogout,
  onAddProduct, onDeleteProduct, onToggleStock,
  onAddCoupon, onDeleteCoupon, onToggleShop, onResetData, toast
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');

  // Form States
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
        <button onClick={onLogout} className="flex items-center gap-2 border border-gray-300 dark:border-white/20 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-[1200px] mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto border-b border-gray-200 dark:border-white/10 pb-4">
          {['menu', 'orders', 'coupons', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize whitespace-nowrap transition-colors
                ${activeTab === tab 
                  ? 'bg-ice-accent text-black border-ice-accent' 
                  : 'bg-transparent border-gray-300 dark:border-white/20 dark:text-white text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              {tab === 'menu' ? '📋 Menu' : tab === 'orders' ? '📦 Orders' : tab === 'coupons' ? '🎟️ Coupons' : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-light-card dark:bg-ice-card p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-bold mb-4 text-lg">Add New Product</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="input-field" placeholder="Name" />
                <input type="number" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="input-field" placeholder="Price (₹)" />
                <select value={newProd.cat} onChange={e => setNewProd({...newProd, cat: e.target.value})} className="input-field">
                  <option>Sticks</option>
                  <option>Cones</option>
                  <option>Family</option>
                </select>
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
                  <div className="flex justify-between mb-2">
                    <strong className="text-ice-accent">Order #{String(o.id).slice(-4)}</strong>
                    <span className="text-xs text-gray-500 dark:text-ice-text2">{o.time}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-ice-text2 mb-2">
                    {o.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                  </div>
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
                <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value as any})} className="input-field">
                  <option value="percent">% Off</option>
                  <option value="flat">₹ Flat Off</option>
                </select>
                <button onClick={handleAddCoupon} className="px-6 py-2 bg-ice-accent text-black font-semibold rounded-lg whitespace-nowrap hover:brightness-110">Add</button>
              </div>
            </div>
            
            <div className="grid gap-3">
              {coupons.map(c => (
                <div key={c.code} className="bg-light-card dark:bg-ice-card p-4 rounded-xl border border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <div>
                    <strong className="text-lg">{c.code}</strong>
                    <span className="ml-2 text-gray-500 dark:text-ice-text2">{c.value}{c.type === 'percent' ? '%' : '₹'} off</span>
                  </div>
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
              <button 
                onClick={onToggleShop}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${shopOpen ? 'bg-ice-danger/10 text-ice-danger hover:bg-ice-danger/20' : 'bg-ice-success/10 text-ice-success hover:bg-ice-success/20'}`}
              >
                {shopOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {shopOpen ? 'Close Shop' : 'Open Shop'}
              </button>
            </div>
            
            <div className="bg-light-card dark:bg-ice-card p-6 rounded-xl border border-gray-200 dark:border-white/10">
              <h3 className="font-bold text-lg mb-2 text-ice-danger">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-ice-text2 mb-4">Permanently clear all products, orders, and settings.</p>
              <button onClick={() => { if(confirm('Are you sure?')) onResetData(); }} className="px-6 py-2 bg-ice-danger text-white rounded-lg hover:bg-red-600 transition-colors">
                Reset App Data
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: transparent;
          border: 1px solid #374151;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          color: inherit;
        }
        .dark .input-field { border-color: rgba(255,255,255,0.2); }
        .input-field:focus { outline: none; border-color: #f7b731; }
      `}</style>
    </div>
  );
};