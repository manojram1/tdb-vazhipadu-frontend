import React from 'react';
import { OrderStatus } from '../../types';
import { Filter, X, Phone } from 'lucide-react';

interface OrderFilterBarProps {
  status: 'ALL' | OrderStatus;
  date: string;
  phoneNumber: string;
  onStatusChange: (status: 'ALL' | OrderStatus) => void;
  onDateChange: (date: string) => void;
  onPhoneChange: (phone: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  status,
  date,
  phoneNumber,
  onStatusChange,
  onDateChange,
  onPhoneChange,
  onClearFilters,
  totalResults,
}) => {
  const hasActiveFilters = status !== 'ALL' || date !== '' || phoneNumber !== '';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-semibold text-stone-800">
            Filter & Search Registry
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-stone-500 font-medium">
            Found <strong className="text-stone-900">{totalResults}</strong> orders
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center text-xs text-amber-800 hover:text-amber-900 font-medium"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Status Filter */}
        <div>
          <label htmlFor="filter-status" className="block text-xs font-semibold text-stone-700 mb-1">
            Status
          </label>
          <select
            id="filter-status"
            data-testid="filter-status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as 'ALL' | OrderStatus)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label htmlFor="filter-date" className="block text-xs font-semibold text-stone-700 mb-1">
            Offering Date
          </label>
          <div className="relative">
            <input
              id="filter-date"
              data-testid="filter-date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {date && (
              <button
                type="button"
                onClick={() => onDateChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
                aria-label="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Phone Search */}
        <div>
          <label htmlFor="filter-phone" className="block text-xs font-semibold text-stone-700 mb-1">
            Search Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <input
              id="filter-phone"
              data-testid="filter-phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="e.g. 98470"
              className="w-full pl-8 pr-7 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
            />
            {phoneNumber && (
              <button
                type="button"
                onClick={() => onPhoneChange('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-stone-400 hover:text-stone-600"
                aria-label="Clear phone filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
