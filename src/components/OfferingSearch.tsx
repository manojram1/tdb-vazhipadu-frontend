import React from 'react';
import { Search, X } from 'lucide-react';

interface OfferingSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export const OfferingSearch: React.FC<OfferingSearchProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label htmlFor="offering-search-input" className="text-sm font-semibold text-stone-800 flex items-center">
          <Search className="w-4 h-4 mr-2 text-amber-700" />
          Search Offerings
        </label>
        <span className="text-xs text-stone-500" aria-live="polite">
          Showing {resultCount} {resultCount === 1 ? 'offering' : 'offerings'}
        </span>
      </div>

      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="offering-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by offering name (e.g. Pushpanjali, Archana)..."
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder:text-stone-400"
          aria-label="Search offerings by name"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
