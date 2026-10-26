import React from 'react';
import { CartItem } from '../../hooks/useCart';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onRemoveItem: (offeringId: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (items.length === 0) {
    return (
      <div
        data-testid="empty-cart"
        className="bg-white rounded-xl p-6 border border-stone-200 text-center shadow-sm"
      >
        <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-700 mb-2">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm">Your Vazhipadu Cart is Empty</h3>
        <p className="text-xs text-stone-500 mt-1">
          Select vazhipadu offerings from the list above to add them to your sacred booking.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="cart-container"
      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
    >
      <div className="p-4 bg-amber-50/50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-amber-800" />
          <h3 className="font-semibold text-sm text-stone-900">
            Selected Offerings ({items.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearCart}
          className="text-xs text-stone-500 hover:text-red-600 transition-colors focus:outline-none"
          aria-label="Clear all offerings from cart"
        >
          Clear All
        </button>
      </div>

      {/* Cart Lines */}
      <ul className="divide-y divide-stone-100 p-2 sm:p-4 space-y-2">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          return (
            <li
              key={item.offeringId}
              data-testid={`cart-item-${item.offeringId}`}
              className="py-2.5 px-2 flex items-center justify-between gap-3 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-stone-900 truncate">
                  {item.offeringName}
                </p>
                <p className="text-xs text-stone-500">
                  ₹{item.price} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.offeringId, item.quantity - 1)}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
                  aria-label={`Decrease quantity of ${item.offeringName}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  data-testid={`quantity-${item.offeringId}`}
                  className="w-7 text-center font-semibold text-xs text-stone-800"
                  aria-label={`Quantity: ${item.quantity}`}
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.offeringId, item.quantity + 1)}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
                  aria-label={`Increase quantity of ${item.offeringName}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line Total & Remove */}
              <div className="text-right flex items-center space-x-2 flex-shrink-0 min-w-[70px] justify-end">
                <span
                  data-testid={`line-total-${item.offeringId}`}
                  className="font-bold text-sm text-stone-900"
                >
                  ₹{lineTotal}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.offeringId)}
                  className="text-stone-400 hover:text-red-600 transition-colors p-1"
                  aria-label={`Remove ${item.offeringName} from cart`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Cart Summary & Total */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
            Total Offering Amount
          </span>
          <span className="text-xs text-stone-400">Inclusive of temple devaswom fees</span>
        </div>
        <div className="text-right">
          <span
            data-testid="cart-total"
            className="text-xl font-extrabold text-amber-900"
          >
            ₹{totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
};
