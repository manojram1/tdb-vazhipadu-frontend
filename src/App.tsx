import React, { useState, useEffect, useCallback } from 'react';
import { Temple, Offering, Order } from './types';
import { getTemples, createOrder } from './api';
import { TempleSelector } from './components/offerings/TempleSelector';
import { OfferingsList } from './components/offerings/OfferingsList';
import { Cart } from './components/cart/Cart';
import { OrderForm, OrderFormData } from './components/cart/OrderForm';
import { OrderConfirmationModal } from './components/cart/OrderConfirmationModal';
import { OrdersList } from './components/orders/OrdersList';
import { useCart } from './hooks/useCart';
import { Flame, Info, ShoppingBag, ClipboardList, BookOpen } from 'lucide-react';

type ActiveView = 'booking' | 'staff';

export const App: React.FC = () => {
  // Navigation View (Devotee Booking vs Staff Orders Registry)
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'staff') {
        return 'staff';
      }
    }
    return 'booking';
  });

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [isLoadingTemples, setIsLoadingTemples] = useState<boolean>(true);
  const [templesError, setTemplesError] = useState<string | null>(null);

  // Order submission state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderSubmissionError, setOrderSubmissionError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Synchronous double-click guard
  const submittingRef = React.useRef<boolean>(false);

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

  const handleSwitchView = (view: ActiveView) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (view === 'staff') {
        params.set('view', 'staff');
      } else {
        params.delete('view');
      }
      const newSearch = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newSearch);
    }
  };

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

  const handleOrderSubmit = async (formData: OrderFormData) => {
    if (!selectedTempleId) {
      alert('Please select a temple before placing your order.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Please add at least one vazhipadu offering to your cart before proceeding.');
      return;
    }

    if (submittingRef.current || isSubmittingOrder) {
      return;
    }

    submittingRef.current = true;
    setIsSubmittingOrder(true);
    setOrderSubmissionError(null);

    try {
      const createdOrder = await createOrder({
        templeId: selectedTempleId,
        devoteeName: formData.devoteeName,
        phoneNumber: formData.phoneNumber,
        nakshatra: formData.nakshatra,
        date: formData.date,
        items: cartItems.map((item) => ({
          offeringId: item.offeringId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setConfirmedOrder(createdOrder);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to place your order with the temple board. Please try again.';
      setOrderSubmissionError(errorMessage);
    } finally {
      submittingRef.current = false;
      setIsSubmittingOrder(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmedOrder(null);
  };

  const handleViewOrdersFromReceipt = () => {
    setConfirmedOrder(null);
    handleSwitchView('staff');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-700/80 rounded-full text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Travancore Devaswom Board</h1>
              <p className="text-xs text-amber-200">Vazhipadu (Temple Offering) Portal</p>
            </div>
          </div>

          {/* Navigation Controls: Devotee Booking vs Staff Orders Registry */}
          <div className="flex items-center space-x-2">
            <nav className="flex bg-amber-900/60 p-1 rounded-lg border border-amber-700/60" aria-label="Portal Navigation">
              <button
                type="button"
                data-testid="tab-devotee-portal"
                onClick={() => handleSwitchView('booking')}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeView === 'booking'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Devotee Booking
              </button>
              <button
                type="button"
                data-testid="tab-staff-portal"
                onClick={() => handleSwitchView('staff')}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeView === 'staff'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                Staff Registry
              </button>
            </nav>

            {activeView === 'booking' && (
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {activeView === 'booking' ? (
          <>
            {/* Devotee Info Banner */}
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

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Offerings List */}
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

              {/* Right Column: Cart and Devotee Order Form */}
              <section aria-label="Cart and Order Details" className="lg:col-span-5 space-y-5">
                <Cart
                  items={cartItems}
                  totalAmount={totalAmount}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onClearCart={clearCart}
                />

                <OrderForm
                  onSubmit={handleOrderSubmit}
                  isSubmitting={isSubmittingOrder}
                  submissionError={orderSubmissionError}
                  onClearSubmissionError={() => setOrderSubmissionError(null)}
                  disabled={cartItems.length === 0}
                  submitButtonText={
                    cartItems.length === 0
                      ? 'Add Offerings to Continue'
                      : `Place Order (₹${totalAmount})`
                  }
                />
              </section>
            </div>
          </>
        ) : (
          /* Staff Orders Registry View (P4) */
          <section aria-labelledby="staff-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="staff-heading" className="text-lg font-bold text-stone-900">
                  Temple Staff Orders Registry
                </h2>
                <p className="text-xs text-stone-500">
                  Search, filter, paginate, and manage devotee vazhipadu bookings across all temples.
                </p>
              </div>
            </div>
            <OrdersList />
          </section>
        )}
      </main>

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={handleCloseConfirmation}
        onViewOrders={handleViewOrdersFromReceipt}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Travancore Devaswom Board (TDB) • Official Vazhipadu Portal
      </footer>
    </div>
  );
};

export default App;
