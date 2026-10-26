import React, { useState, useEffect, useCallback } from 'react';
import { Temple, Offering } from './types';
import { getTemples } from './api';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';
import { Cart } from './components/Cart';
import { OrderForm, OrderFormData } from './components/OrderForm';
import { useCart } from './hooks/useCart';
import { Flame, Info, ShoppingBag } from 'lucide-react';

export const App: React.FC = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [isLoadingTemples, setIsLoadingTemples] = useState<boolean>(true);
  const [templesError, setTemplesError] = useState<string | null>(null);

  // Cart hook with localStorage persistence
  const {
    items: cartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalQuantity,
    itemQuantities,
  } = useCart();

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
    addItem(offering);
  };

  const handleOrderSubmit = (formData: OrderFormData) => {
    if (cartItems.length === 0) {
      alert('Please add at least one vazhipadu offering to your cart before proceeding.');
      return;
    }
    // Form validated successfully - ready for P3 Order Confirmation
    console.log('Order submitted for validation:', { formData, cartItems, totalAmount });
    alert(`Order details validated successfully for ${formData.devoteeName}! Total: ₹${totalAmount}`);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-700/80 rounded-full text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Travancore Devaswom Board</h1>
              <p className="text-xs text-amber-200">Vazhipadu (Temple Offering) Booking Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div
              data-testid="header-cart-badge"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-900/80 border border-amber-700/60 text-xs font-semibold text-amber-100"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>₹{totalAmount}</span>
              <span className="bg-amber-700 px-1.5 py-0.5 rounded-full text-[11px]">
                {totalQuantity}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Banner with instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Select your preferred temple, choose ritual offerings, and complete the devotee details with your birth star. Offerings are conducted by temple priests on the designated sacred date.
          </p>
        </div>

        {/* Temple Selection */}
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

        {/* 2-Column Responsive Layout: Offerings List on Left, Cart + Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Offerings List (7 cols on desktop) */}
          <section aria-labelledby="offerings-heading" className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="offerings-heading" className="text-base font-bold text-stone-800">
                Offerings at {currentTemple?.name || 'Temple'}
              </h2>
            </div>
            <OfferingsList
              templeId={selectedTempleId}
              templeName={currentTemple?.name}
              onAddToCart={handleAddToCart}
              cartItems={itemQuantities}
            />
          </section>

          {/* Right Column: Cart and Devotee Order Form (5 cols on desktop) */}
          <section aria-label="Cart and Order Details" className="lg:col-span-5 space-y-5">
            {/* Cart Section */}
            <Cart
              items={cartItems}
              totalAmount={totalAmount}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onClearCart={clearCart}
            />

            {/* Order Form Section */}
            <OrderForm
              onSubmit={handleOrderSubmit}
              disabled={cartItems.length === 0}
              submitButtonText={
                cartItems.length === 0
                  ? 'Add Offerings to Continue'
                  : `Proceed to Book (₹${totalAmount})`
              }
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Travancore Devaswom Board (TDB) • Frontend Assessment (P2: Cart & Form)
      </footer>
    </div>
  );
};

export default App;
