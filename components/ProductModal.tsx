import React from 'react';
import { X, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  shopOpen: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, shopOpen }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-light-card dark:bg-ice-card w-full max-w-[400px] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-light-card dark:bg-ice-card">
          <h3 className="text-lg font-bold font-serif dark:text-white text-gray-900">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-ice-text2 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-xl mb-4" />
          
          <p className="text-gray-600 dark:text-ice-text2 mb-4 text-sm">Delicious {product.name} made with fresh ingredients. Perfect for a quick treat!</p>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-ice-accent">₹{product.price}</h2>
            <div className="flex items-center gap-1 text-ice-accent text-sm font-medium">
              <Star size={16} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            disabled={!product.inStock || !shopOpen}
            className={`w-full py-3 rounded-lg font-bold transition-all
              ${(!product.inStock || !shopOpen)
                ? 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-ice-accent to-ice-accent2 text-black hover:opacity-90 shadow-lg'
              }`}
          >
            {(!shopOpen) ? 'Shop Closed' : (!product.inStock ? 'Out of Stock' : 'Add to Cart')}
          </button>
        </div>
      </div>
    </div>
  );
};