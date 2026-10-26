import React from 'react';
import { Offering } from '../../types';
import { Sparkles, Plus } from 'lucide-react';

interface OfferingCardProps {
  offering: Offering;
  onAddToCart?: (offering: Offering) => void;
  cartQuantity?: number;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({
  offering,
  onAddToCart,
  cartQuantity = 0,
}) => {
  return (
    <div
      data-testid={`offering-card-${offering.id}`}
      className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base text-stone-900 leading-tight">
            {offering.name}
          </h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold text-amber-900 bg-amber-100 flex-shrink-0">
            ₹{offering.price}
          </span>
        </div>

        {offering.description && (
          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {offering.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-500 flex items-center">
          <Sparkles className="w-3 h-3 text-amber-600 mr-1" />
          Devotional ritual
        </span>

        {onAddToCart && (
          <button
            type="button"
            onClick={() => onAddToCart(offering)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
            aria-label={`Add ${offering.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {cartQuantity > 0 ? `Add More (${cartQuantity})` : 'Add to Booking'}
          </button>
        )}
      </div>
    </div>
  );
};
