import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';
import * as api from '../../api';
import { Temple, Offering, Order } from '../../types';

const mockTemples: Temple[] = [
  {
    id: 'sabarimala',
    name: 'Sabarimala Temple',
    location: 'Pathanamthitta',
    deity: 'Lord Ayyappa',
  },
];

const mockOfferings: Offering[] = [
  {
    id: 'sab-1',
    templeId: 'sabarimala',
    name: 'Pushpanjali',
    price: 30,
    active: true,
  },
  {
    id: 'sab-2',
    templeId: 'sabarimala',
    name: 'Archana',
    price: 50,
    active: true,
  },
];

const mockCreatedOrder: Order = {
  id: 'order-1234',
  orderNumber: 'TDB-2026-9999',
  templeId: 'sabarimala',
  templeName: 'Sabarimala Temple',
  devoteeName: 'Manoj Ramakrishnan',
  phoneNumber: '9847012345',
  nakshatra: 'Rohini',
  date: '2026-11-15',
  items: [
    {
      offeringId: 'sab-1',
      offeringName: 'Pushpanjali',
      price: 30,
      quantity: 2,
    },
    {
      offeringId: 'sab-2',
      offeringName: 'Archana',
      price: 50,
      quantity: 1,
    },
  ],
  totalAmount: 110,
  status: 'CONFIRMED',
  createdAt: new Date().toISOString(),
};

describe('Order Confirmation Flow (P3)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    vi.restoreAllMocks();

    vi.spyOn(api, 'getTemples').mockResolvedValue(mockTemples);
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);
  });

  it('acceptance criterion: double-clicking Place order creates one order', async () => {
    const user = userEvent.setup();

    let callCount = 0;
    vi.spyOn(api, 'createOrder').mockImplementation(async () => {
      callCount++;
      await new Promise((res) => setTimeout(res, 80));
      return mockCreatedOrder;
    });

    render(<App />);

    // Wait for offerings to load
    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Add offering to cart
    const addPushpanjaliBtn = screen.getByRole('button', {
      name: /add pushpanjali to cart/i,
    });
    await user.click(addPushpanjaliBtn);

    // Fill valid form fields
    const nameInput = screen.getByLabelText(/devotee full name/i);
    const phoneInput = screen.getByLabelText(/devotee mobile number/i);
    const starSelect = screen.getByLabelText(/birth star/i);
    const dateInput = screen.getByLabelText(/date of offering/i);

    await user.type(nameInput, 'Manoj Ramakrishnan');
    await user.type(phoneInput, '9847012345');
    await user.selectOptions(starSelect, 'Rohini');
    await user.type(dateInput, '2026-11-15');

    const placeOrderBtn = screen.getByTestId('place-order-button');
    expect(placeOrderBtn).toBeEnabled();

    // Acceptance criterion: simulate double click
    await user.dblClick(placeOrderBtn);

    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation-modal')).toBeInTheDocument();
    });

    // Acceptance criterion: exactly 1 order placed
    expect(callCount).toBe(1);
    expect(api.createOrder).toHaveBeenCalledTimes(1);
  });

  it('acceptance criterion: after a failure, the cart and form are unchanged and a retry works', async () => {
    const user = userEvent.setup();

    // First call rejects with network failure, second call succeeds
    const createOrderSpy = vi
      .spyOn(api, 'createOrder')
      .mockRejectedValueOnce(new Error('Network error: Temporary temple server timeout'))
      .mockResolvedValueOnce(mockCreatedOrder);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Add 2 Pushpanjali and 1 Archana
    const addPushpanjali = screen.getByRole('button', {
      name: /add pushpanjali to cart/i,
    });
    await user.click(addPushpanjali);
    await user.click(addPushpanjali); // Add second one

    const addArchana = screen.getByRole('button', {
      name: /add archana to cart/i,
    });
    await user.click(addArchana);

    // Fill form
    const nameInput = screen.getByLabelText(/devotee full name/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/devotee mobile number/i) as HTMLInputElement;
    const starSelect = screen.getByLabelText(/birth star/i) as HTMLSelectElement;
    const dateInput = screen.getByLabelText(/date of offering/i) as HTMLInputElement;

    await user.type(nameInput, 'Manoj Ramakrishnan');
    await user.type(phoneInput, '9847012345');
    await user.selectOptions(starSelect, 'Rohini');
    await user.type(dateInput, '2026-11-15');

    // Submit order -> should fail
    const placeOrderBtn = screen.getByTestId('place-order-button');
    await user.click(placeOrderBtn);

    // Verify error banner is shown
    await waitFor(() => {
      expect(screen.getByTestId('order-submission-error')).toBeInTheDocument();
    });

    expect(screen.getByText(/Temporary temple server timeout/i)).toBeInTheDocument();

    // Verify cart is UNCHANGED after failure
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹110');
    expect(screen.getByTestId('quantity-sab-1')).toHaveTextContent('2');
    expect(screen.getByTestId('quantity-sab-2')).toHaveTextContent('1');

    // Verify form values are UNCHANGED after failure
    expect(nameInput.value).toBe('Manoj Ramakrishnan');
    expect(phoneInput.value).toBe('9847012345');
    expect(starSelect.value).toBe('Rohini');
    expect(dateInput.value).toBe('2026-11-15');

    // Retry by clicking Place Order again
    await user.click(placeOrderBtn);

    // Second attempt should succeed and show confirmation modal
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation-modal')).toBeInTheDocument();
    });

    expect(screen.getByTestId('confirmed-order-number')).toHaveTextContent('TDB-2026-9999');
    expect(screen.getByTestId('confirmed-total-amount')).toHaveTextContent('₹110');

    // And verify cart was emptied on success!
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument();
    expect(createOrderSpy).toHaveBeenCalledTimes(2);
  });
});
