import React from 'react';
import { Flame } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-amber-800 text-amber-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-700 rounded-full">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Travancore Devaswom Board</h1>
              <p className="text-xs text-amber-200">Vazhipadu (Temple Offering) Booking Portal</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-900/60 rounded text-amber-200 border border-amber-700/50">
            System Online
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center max-w-xl mx-auto">
          <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-700 mb-4">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Welcome to TDB Vazhipadu Portal</h2>
          <p className="text-stone-600 mb-6 text-sm">
            Base Vite + React 18 + TypeScript environment initialized with in-memory typed Mock API,
            Tailwind CSS, and Vitest test suite.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Travancore Devaswom Board (TDB) • Frontend Assessment
      </footer>
    </div>
  );
};

export default App;
