import React from 'react';
import { Order } from '../../types';
import { CheckCircle2, Calendar, User, Star, Landmark, Phone, ArrowRight, Printer } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      data-testid="order-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Sacred Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 p-6 text-center relative">
          <div className="inline-flex p-3 bg-amber-600/50 rounded-full text-amber-200 ring-4 ring-amber-500/30 mb-2">
            <CheckCircle2 className="w-8 h-8 text-amber-200" />
          </div>
          <h2 id="confirmation-modal-title" className="text-xl font-bold tracking-tight">
            Vazhipadu Booking Confirmed!
          </h2>
          <p className="text-xs text-amber-200 mt-1">
            May the blessings of the deity bring peace and prosperity to your family.
          </p>
          <div className="mt-3 inline-block bg-amber-900/60 px-3 py-1 rounded-full border border-amber-600/40 text-xs font-mono font-semibold tracking-wider text-amber-100">
            Booking Ref: <span data-testid="confirmed-order-number">{order.orderNumber}</span>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-stone-700 flex-1">
          {/* Key Details Grid */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500 flex items-center">
                <Landmark className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Temple
              </span>
              <span className="font-semibold text-stone-900">{order.templeName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Devotee
              </span>
              <span className="font-semibold text-stone-900">{order.devoteeName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500 flex items-center">
                <Star className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Birth Star (Nakshatra)
              </span>
              <span className="font-semibold text-stone-900">{order.nakshatra}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Mobile
              </span>
              <span className="font-mono text-stone-900">{order.phoneNumber}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Offering Date
              </span>
              <span className="font-semibold text-stone-900">{order.date}</span>
            </div>
          </div>

          {/* Booked Offerings */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Offerings Scheduled
            </h4>
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 divide-y divide-stone-200/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{item.offeringName}</span>
                    <span className="text-stone-500 ml-2">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-medium text-stone-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between text-sm font-bold text-stone-900">
                <span>Grand Total Paid</span>
                <span data-testid="confirmed-total-amount" className="text-base text-amber-900">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors focus:outline-none"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Receipt
          </button>
          {onViewOrders && (
            <button
              type="button"
              onClick={onViewOrders}
              className="flex-1 inline-flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-900 text-white transition-colors focus:outline-none"
            >
              View All Orders
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors focus:outline-none shadow-sm"
          >
            Book Another Offering
          </button>
        </div>
      </div>
    </div>
  );
};
