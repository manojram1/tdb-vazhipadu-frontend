import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../../types';
import { getOrders, cancelOrder } from '../../api';
import { OrderFilterBar } from './OrderFilterBar';
import { CancelOrderModal } from './CancelOrderModal';
import {
  ClipboardList,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Ban,
  CheckCircle,
} from 'lucide-react';

const FILTER_STORAGE_KEY = 'tdb_orders_filter_state';

interface FilterState {
  status: 'ALL' | OrderStatus;
  date: string;
  phoneNumber: string;
  page: number;
}

function getInitialFilters(): FilterState {
  // First try URL search params
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page') || '1', 10);
    const urlStatus = (params.get('status') || 'ALL') as 'ALL' | OrderStatus;
    const urlDate = params.get('date') || '';
    const urlPhone = params.get('phone') || '';

    return {
      status: urlStatus,
      date: urlDate,
      phoneNumber: urlPhone,
      page: isNaN(urlPage) || urlPage < 1 ? 1 : urlPage,
    };
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse filter storage:', e);
    }
  }

  return {
    status: 'ALL',
    date: '',
    phoneNumber: '',
    page: 1,
  };
}

export const OrdersList: React.FC = () => {
  const initial = getInitialFilters();

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Pagination
  const [status, setStatus] = useState<'ALL' | OrderStatus>(initial.status);
  const [date, setDate] = useState<string>(initial.date);
  const [phoneNumber, setPhoneNumber] = useState<string>(initial.phoneNumber);
  const [page, setPage] = useState<number>(initial.page);

  // Cancellation Modal State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Sync state to URL and localStorage
  const syncFiltersToUrlAndStorage = useCallback(
    (newFilters: FilterState) => {
      if (typeof window === 'undefined') return;

      try {
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(newFilters));

        const params = new URLSearchParams();
        if (newFilters.page > 1) params.set('page', String(newFilters.page));
        if (newFilters.status !== 'ALL') params.set('status', newFilters.status);
        if (newFilters.date) params.set('date', newFilters.date);
        if (newFilters.phoneNumber) params.set('phone', newFilters.phoneNumber);

        const newSearch = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState(null, '', newSearch);
      } catch (e) {
        console.error('Failed to sync filter state:', e);
      }
    },
    []
  );

  const fetchOrdersList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrders({
        status,
        date: date || undefined,
        phoneNumber: phoneNumber || undefined,
        page,
        pageSize: 10,
      });

      setOrders(response.orders);
      setTotalOrders(response.total);
      setTotalPages(response.totalPages);

      syncFiltersToUrlAndStorage({
        status,
        date,
        phoneNumber,
        page,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve orders registry from the temple board.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [status, date, phoneNumber, page, syncFiltersToUrlAndStorage]);

  useEffect(() => {
    fetchOrdersList();
  }, [fetchOrdersList]);

  // Acceptance Criterion: Filtering by status shows only matching orders and goes back to page 1
  const handleStatusChange = (newStatus: 'ALL' | OrderStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to page 1
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setPage(1);
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhoneNumber(newPhone);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStatus('ALL');
    setDate('');
    setPhoneNumber('');
    setPage(1);
  };

  // Order Cancellation Handlers
  const handleOpenCancelModal = (order: Order) => {
    setOrderToCancel(order);
  };

  const handleCloseCancelModal = () => {
    if (!isCancelling) {
      setOrderToCancel(null);
    }
  };

  // Acceptance Criterion: A cancelled order shows as cancelled without reloading the page
  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    setIsCancelling(true);
    try {
      const cancelled = await cancelOrder(orderToCancel.id);

      // In-place state update: update this order in the list without page reload
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === cancelled.id ? { ...o, status: 'CANCELLED' } : o))
      );

      setOrderToCancel(null);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to cancel the order. Please try again.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="staff-orders-view">
      {/* Filters Bar */}
      <OrderFilterBar
        status={status}
        date={date}
        phoneNumber={phoneNumber}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onPhoneChange={handlePhoneChange}
        onClearFilters={handleClearFilters}
        totalResults={totalOrders}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-48"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-stone-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      )}

      {/* Error State with Retry Button */}
      {!isLoading && error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-800 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Failed to load orders registry</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchOrdersList}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="bg-white rounded-xl p-10 border border-stone-200 text-center shadow-sm">
          <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-700 mb-2">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-stone-800">No Orders Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            No orders match the selected filters. Try broadening your date or status selection.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-3 px-3.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors focus:outline-none"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Orders Table & Cards */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 divide-y divide-stone-200">
              <thead className="bg-stone-50 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Order Ref / Temple</th>
                  <th scope="col" className="px-4 py-3">Ritual Date</th>
                  <th scope="col" className="px-4 py-3">Devotee Details</th>
                  <th scope="col" className="px-4 py-3">Offerings Booked</th>
                  <th scope="col" className="px-4 py-3">Total Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {orders.map((order) => {
                  const isCancelled = order.status === 'CANCELLED';
                  return (
                    <tr
                      key={order.id}
                      data-testid={`order-row-${order.id}`}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      {/* Ref & Temple */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-stone-900 block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[150px] block">
                          {order.templeName}
                        </span>
                      </td>

                      {/* Ritual Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-stone-800 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                          {order.date}
                        </span>
                      </td>

                      {/* Devotee */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-stone-900 block">
                          {order.devoteeName}
                        </span>
                        <span className="text-[11px] text-stone-500 flex items-center mt-0.5">
                          <Phone className="w-3 h-3 mr-1 text-stone-400" />
                          {order.phoneNumber}
                        </span>
                        <span className="text-[11px] text-amber-800 font-medium block">
                          {order.nakshatra}
                        </span>
                      </td>

                      {/* Offerings */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <ul className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-[11px] text-stone-700 truncate">
                              <strong>{item.quantity}x</strong> {item.offeringName}
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-extrabold text-sm text-stone-900">
                          ₹{order.totalAmount}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          data-testid={`order-status-${order.id}`}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isCancelled
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isCancelled ? (
                            <>
                              <Ban className="w-3 h-3 mr-1 text-red-600" />
                              CANCELLED
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                              CONFIRMED
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {!isCancelled ? (
                          <button
                            type="button"
                            data-testid={`cancel-button-${order.id}`}
                            onClick={() => handleOpenCancelModal(order)}
                            className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors focus:outline-none"
                            aria-label={`Cancel order ${order.orderNumber}`}
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span data-testid="page-indicator" className="text-xs text-stone-600 font-medium">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> (Total {totalOrders} orders)
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                data-testid="prev-page-button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </button>
              <button
                type="button"
                data-testid="next-page-button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Cancellation */}
      <CancelOrderModal
        order={orderToCancel}
        isOpen={Boolean(orderToCancel)}
        isCancelling={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseCancelModal}
      />
    </div>
  );
};
