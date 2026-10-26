import React, { useState, useEffect, useCallback } from 'react';
import { Temple, Offering } from './types';
import { getTemples } from './api';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';
import { Flame, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [isLoadingTemples, setIsLoadingTemples] = useState<boolean>(true);
  const [templesError, setTemplesError] = useState<string | null>(null);

  const fetchTemplesList = useCallback(async () => {
    setIsLoadingTemples(true);
    setTemplesError(null);
    try {
      const data = await getTemples();
      setTemples(data);
      if (data.length > 0 && !selectedTempleId) {
        setSelectedTempleId(data[0].id);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to connect to the Temple Board server.';
      setTemplesError(message);
    } finally {
      setIsLoadingTemples(false);
    }
  }, [selectedTempleId]);

  useEffect(() => {
    fetchTemplesList();
  }, [fetchTemplesList]);

  const currentTemple = temples.find((t) => t.id === selectedTempleId);

  const handleAddToCart = (offering: Offering) => {
    // Handler ready for P2 cart integration
    console.log('Offering selected:', offering.name);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-700/80 rounded-full text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Travancore Devaswom Board</h1>
              <p className="text-xs text-amber-200">Vazhipadu (Temple Offering) Booking Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded bg-amber-900/70 text-amber-200 border border-amber-700/60">
              Devotee Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Banner with instructions / devotional notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Select a consecrated temple below to explore and book daily vazhipadu rituals. Offerings are conducted in strict adherence to sacred temple traditions.
          </p>
        </div>

        {/* Problem 1: Temple Selection */}
        <section aria-labelledby="temple-heading">
          <h2 id="temple-heading" className="sr-only">Temple Selection</h2>
          <TempleSelector
            temples={temples}
            selectedTempleId={selectedTempleId}
            onSelectTemple={setSelectedTempleId}
            isLoading={isLoadingTemples}
            error={templesError}
            onRetry={fetchTemplesList}
          />
        </section>

        {/* Problem 1: Offerings List with Search */}
        <section aria-labelledby="offerings-heading">
          <h2 id="offerings-heading" className="sr-only">Available Offerings</h2>
          <OfferingsList
            templeId={selectedTempleId}
            templeName={currentTemple?.name}
            onAddToCart={handleAddToCart}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Travancore Devaswom Board (TDB) • Frontend Assessment (P1: Offerings List)
      </footer>
    </div>
  );
};

export default App;
