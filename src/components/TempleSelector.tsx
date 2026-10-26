import React from 'react';
import { Temple } from '../types';
import { Landmark, AlertCircle, RefreshCw } from 'lucide-react';

interface TempleSelectorProps {
  temples: Temple[];
  selectedTempleId: string | null;
  onSelectTemple: (templeId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const TempleSelector: React.FC<TempleSelectorProps> = ({
  temples,
  selectedTempleId,
  onSelectTemple,
  isLoading,
  error,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-48 mb-3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-16 bg-stone-100 rounded-lg"></div>
          <div className="h-16 bg-stone-100 rounded-lg"></div>
          <div className="h-16 bg-stone-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-800 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Failed to load temples</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="temple-select" className="text-sm font-semibold text-stone-800 flex items-center">
          <Landmark className="w-4 h-4 mr-2 text-amber-700" />
          Select Temple
        </label>
        <span className="text-xs text-stone-500">
          {temples.length} {temples.length === 1 ? 'temple' : 'temples'} available
        </span>
      </div>

      {/* Responsive Cards for Quick Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Select a temple">
        {temples.map((temple) => {
          const isSelected = temple.id === selectedTempleId;
          return (
            <button
              key={temple.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectTemple(temple.id)}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-1 ring-amber-600'
                  : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-sm text-stone-900 leading-snug">
                  {temple.name}
                </span>
                {isSelected && (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-600 mt-1 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-stone-600 mt-1">{temple.location}</p>
              {temple.deity && (
                <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  {temple.deity}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
