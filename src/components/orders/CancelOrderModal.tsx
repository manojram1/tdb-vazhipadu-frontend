import React from 'react';
import { Order } from '../../types';
import { AlertTriangle, X } from 'lucide-react';

interface CancelOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  order,
  isOpen,
  isCancelling,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      data-testid="cancel-order-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-red-50 text-red-700 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="text-stone-400 hover:text-stone-600 p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 id="cancel-modal-title" className="text-lg font-bold text-stone-900">
            Confirm Order Cancellation
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Are you sure you want to cancel vazhipadu booking{' '}
            <strong className="text-stone-900">{order.orderNumber}</strong> for{' '}
            <strong className="text-stone-900">{order.devoteeName}</strong>?
          </p>
        </div>

        <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 space-y-1 border border-stone-200">
          <p><strong>Temple:</strong> {order.templeName}</p>
          <p><strong>Ritual Date:</strong> {order.date}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        </div>

        <p className="text-[11px] text-red-600 font-medium">
          Note: This action marks the offering as cancelled in the Devaswom registry and cannot be undone.
        </p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
          >
            Keep Order
          </button>
          <button
            type="button"
            data-testid="confirm-cancel-button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none shadow-sm disabled:bg-red-300 flex items-center space-x-1.5"
          >
            <span>{isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
