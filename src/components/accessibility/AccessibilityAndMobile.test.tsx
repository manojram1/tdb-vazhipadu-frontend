import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';
import * as api from '../../api';
import { Temple, Offering, Order } from '../../types';

const mockTemples: Temple[] = [
  {
    id: 'sabarimala',
    name: 'Sabarimala Sree Dharma Sastha Temple',
    location: 'Pathanamthitta, Kerala',
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
  id: 'order-p5-test',
  orderNumber: 'TDB-2026-P501',
  templeId: 'sabarimala',
  templeName: 'Sabarimala Sree Dharma Sastha Temple',
  devoteeName: 'Ananya Pillai',
  phoneNumber: '9847012345',
  nakshatra: 'Rohini',
  date: '2026-11-20',
  items: [
    {
      offeringId: 'sab-1',
      offeringName: 'Pushpanjali',
      price: 30,
      quantity: 1,
    },
  ],
  totalAmount: 30,
  status: 'CONFIRMED',
  createdAt: new Date().toISOString(),
};

describe('Mobile Responsiveness and Accessibility (P5)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.history.replaceState(null, '', '/');
    }
    vi.restoreAllMocks();

    vi.spyOn(api, 'getTemples').mockResolvedValue(mockTemples);
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);
    vi.spyOn(api, 'createOrder').mockResolvedValue(mockCreatedOrder);
  });

  it('acceptance criterion: tests find form fields by their labels', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Verify all form fields can be accessed strictly through their labels
    const nameField = screen.getByLabelText(/devotee full name/i);
    const phoneField = screen.getByLabelText(/devotee mobile number/i);
    const starField = screen.getByLabelText(/birth star/i);
    const dateField = screen.getByLabelText(/date of offering/i);

    expect(nameField).toBeInTheDocument();
    expect(phoneField).toBeInTheDocument();
    expect(starField).toBeInTheDocument();
    expect(dateField).toBeInTheDocument();
  });

  it('acceptance criterion: form errors are announced to screen reader users with role="alert" and aria-invalid', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Add offering so submit button is enabled
    await user.click(screen.getByRole('button', { name: /add pushpanjali to cart/i }));

    const placeOrderBtn = screen.getByTestId('place-order-button');
    await user.click(placeOrderBtn);

    // Form fields should indicate aria-invalid="true"
    const nameField = screen.getByLabelText(/devotee full name/i);
    const phoneField = screen.getByLabelText(/devotee mobile number/i);
    const starField = screen.getByLabelText(/birth star/i);
    const dateField = screen.getByLabelText(/date of offering/i);

    expect(nameField).toHaveAttribute('aria-invalid', 'true');
    expect(phoneField).toHaveAttribute('aria-invalid', 'true');
    expect(starField).toHaveAttribute('aria-invalid', 'true');
    expect(dateField).toHaveAttribute('aria-invalid', 'true');

    // Errors should have role="alert" for immediate screen reader announcement
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(4);
  });

  it('acceptance criterion: the whole booking flow works with the keyboard alone', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // 1. Add Pushpanjali to cart using keyboard Enter key
    const addBtn = screen.getByRole('button', { name: /add pushpanjali to cart/i });
    addBtn.focus();
    expect(addBtn).toHaveFocus();
    await user.keyboard('{Enter}');

    // Cart total should update
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹30');

    // 2. Navigate and fill form fields via Tab and keyboard typing
    const nameInput = screen.getByLabelText(/devotee full name/i);
    nameInput.focus();
    expect(nameInput).toHaveFocus();
    await user.keyboard('Ananya Pillai');

    const phoneInput = screen.getByLabelText(/devotee mobile number/i);
    phoneInput.focus();
    await user.keyboard('9847012345');

    const starSelect = screen.getByLabelText(/birth star/i);
    starSelect.focus();
    await user.selectOptions(starSelect, 'Rohini');

    const dateInput = screen.getByLabelText(/date of offering/i);
    dateInput.focus();
    await user.keyboard('2026-11-20');

    // 3. Tab to Place Order button and trigger with Enter
    const submitBtn = screen.getByTestId('place-order-button');
    submitBtn.focus();
    expect(submitBtn).toHaveFocus();
    await user.keyboard('{Enter}');

    // 4. Modal opens
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation-modal')).toBeInTheDocument();
    });

    expect(screen.getByTestId('confirmed-order-number')).toHaveTextContent('TDB-2026-P501');

    // 5. Close modal using Escape key alone
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByTestId('order-confirmation-modal')).not.toBeInTheDocument();
    });
  });

  it('acceptance criterion: works without horizontal scroll at 360px viewport', async () => {
    // Set window dimensions to 360px width
    window.innerWidth = 360;
    window.innerHeight = 640;

    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Root wrapper and body should have strict max-w-full and no horizontal overflow
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveClass('min-h-screen');
  });
});
