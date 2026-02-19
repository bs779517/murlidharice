import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { CONFIG } from '../constants';

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

export const CartModal: React.FC<CartModalProps> = ({
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
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-light-card dark:bg-ice-card rounded-t-2xl z-10">
          <h2 className="text-xl font-bold dark:text-white text-gray-800">Your Cart 🛒</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-ice-text2 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
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
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium w-4 text-center dark:text-white">{item.qty}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 bg-light-bg dark:bg-ice-bg border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ice-accent dark:text-white"
                  />
                  <button onClick={handleApplyCoupon} className="border border-gray-300 dark:border-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 dark:text-white">Apply</button>
                </div>
                {couponMsg && (
                  <div className={`text-xs ${couponMsg.includes('Invalid') ? 'text-ice-danger' : 'text-ice-success'}`}>
                    {couponMsg}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-light-bg dark:bg-ice-bg p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2 text-sm dark:text-ice-text2">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-sm text-ice-success">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between mb-2 text-sm dark:text-ice-text2">
                  <span>Delivery</span>
                  <span>₹{delivery}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 dark:border-white/10 font-bold text-lg dark:text-white text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-ice-accent to-ice-accent2 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Order via WhatsApp 📱
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};