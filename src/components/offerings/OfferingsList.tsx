import React, { useState, useEffect, useCallback } from 'react';
import { Offering } from '../../types';
import { getOfferings } from '../../api';
import { OfferingSearch } from './OfferingSearch';
import { OfferingCard } from './OfferingCard';
import { AlertCircle, RefreshCw, Sparkles, Inbox } from 'lucide-react';

interface OfferingsListProps {
  templeId: string | null;
  templeName?: string;
  onAddToCart?: (offering: Offering) => void;
  cartItems?: Record<string, number>; // offeringId -> quantity
}

export const OfferingsList: React.FC<OfferingsListProps> = ({
  templeId,
  templeName = 'Selected Temple',
  onAddToCart,
  cartItems = {},
}) => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchOfferings = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOfferings(id);
      // Requirement: Inactive offerings are not offered for booking
      const activeOfferings = data.filter((item) => item.active);
      setOfferings(activeOfferings);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load offerings from the temple server.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (templeId) {
      setSearchQuery('');
      fetchOfferings(templeId);
    } else {
      setOfferings([]);
      setError(null);
    }
  }, [templeId, fetchOfferings]);

  // Filter offerings by name search
  const filteredOfferings = offerings.filter((offering) =>
    offering.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (!templeId) {
    return (
      <div className="bg-white rounded-xl p-8 border border-stone-200 text-center text-stone-500">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="font-medium text-stone-700">Please choose a temple above to view available vazhipadu offerings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <OfferingSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={isLoading ? 0 : filteredOfferings.length}
      />

      {/* Loading State */}
      {isLoading && (
        <div aria-label="Loading offerings" aria-busy="true" className="space-y-3">
          <div className="flex items-center text-xs text-amber-800 animate-pulse font-medium">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Loading offerings for {templeName}...
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm animate-pulse flex flex-col justify-between h-40"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-5 bg-stone-200 rounded w-2/3"></div>
                    <div className="h-5 bg-stone-200 rounded w-14"></div>
                  </div>
                  <div className="h-3 bg-stone-100 rounded w-full mt-3"></div>
                  <div className="h-3 bg-stone-100 rounded w-4/5 mt-1.5"></div>
                </div>
                <div className="h-7 bg-stone-100 rounded w-28 mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State with Retry Button */}
      {!isLoading && error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-red-900">
                  Unable to load offerings
                </h4>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchOfferings(templeId)}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none flex-shrink-0"
              aria-label="Try again loading offerings"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty State - No match for search query */}
      {!isLoading && !error && filteredOfferings.length === 0 && (
        <div
          role="status"
          className="bg-white rounded-xl p-8 border border-stone-200 text-center shadow-sm"
        >
          <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-700 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          {searchQuery ? (
            <div>
              <p className="text-sm font-semibold text-stone-800">
                No offerings match "{searchQuery}"
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Check for typos or try searching for a different offering keyword.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <p className="text-sm text-stone-600">
              No active offerings currently available for this temple.
            </p>
          )}
        </div>
      )}

      {/* Offerings Grid */}
      {!isLoading && !error && filteredOfferings.length > 0 && (
        <div
          role="region"
          aria-label="Available offerings list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredOfferings.map((offering) => (
            <OfferingCard
              key={offering.id}
              offering={offering}
              onAddToCart={onAddToCart}
              cartQuantity={cartItems[offering.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};
