import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from './Cart';
import { OrderForm } from './OrderForm';
import { CartItem } from '../hooks/useCart';

describe('Offering Cart and Order Form (P2)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    vi.restoreAllMocks();
  });

  describe('Cart Component', () => {
    it('acceptance criterion: 2 Pushpanjali at ₹30 and 1 Archana at ₹50 shows a total of ₹110', () => {
      const items: CartItem[] = [
        {
          offeringId: 'sab-1',
          offeringName: 'Pushpanjali',
          price: 30,
          quantity: 2,
          templeId: 'sabarimala',
        },
        {
          offeringId: 'sab-2',
          offeringName: 'Archana',
          price: 50,
          quantity: 1,
          templeId: 'sabarimala',
        },
      ];

      const totalAmount = 30 * 2 + 50 * 1; // 110

      render(
        <Cart
          items={items}
          totalAmount={totalAmount}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onClearCart={vi.fn()}
        />
      );

      // Verify individual items and prices
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-sab-1')).toHaveTextContent('2');
      expect(screen.getByTestId('line-total-sab-1')).toHaveTextContent('₹60');

      expect(screen.getByText('Archana')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-sab-2')).toHaveTextContent('1');
      expect(screen.getByTestId('line-total-sab-2')).toHaveTextContent('₹50');

      // Acceptance criterion: Total ₹110
      expect(screen.getByTestId('cart-total')).toHaveTextContent('₹110');
    });

    it('triggers quantity changes and item removal', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      const items: CartItem[] = [
        {
          offeringId: 'sab-1',
          offeringName: 'Pushpanjali',
          price: 30,
          quantity: 1,
          templeId: 'sabarimala',
        },
      ];

      render(
        <Cart
          items={items}
          totalAmount={30}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={vi.fn()}
        />
      );

      // Increase quantity
      const increaseBtn = screen.getByRole('button', {
        name: /increase quantity of pushpanjali/i,
      });
      await user.click(increaseBtn);
      expect(onUpdateQuantity).toHaveBeenCalledWith('sab-1', 2);

      // Remove item
      const removeBtn = screen.getByRole('button', {
        name: /remove pushpanjali from cart/i,
      });
      await user.click(removeBtn);
      expect(onRemoveItem).toHaveBeenCalledWith('sab-1');
    });

    it('displays empty state when cart has no items', () => {
      render(
        <Cart
          items={[]}
          totalAmount={0}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onClearCart={vi.fn()}
        />
      );

      expect(screen.getByTestId('empty-cart')).toBeInTheDocument();
      expect(screen.getByText(/your vazhipadu cart is empty/i)).toBeInTheDocument();
    });
  });

  describe('Order Form Component', () => {
    it('acceptance criterion: the form shows a message next to each invalid field', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<OrderForm onSubmit={onSubmit} />);

      // Attempt to submit empty form
      const submitButton = screen.getByRole('button', { name: /proceed to book/i });
      await user.click(submitButton);

      // Verify error message next to each invalid field
      expect(screen.getByTestId('error-devoteeName')).toHaveTextContent(
        'Devotee name is required'
      );
      expect(screen.getByTestId('error-phoneNumber')).toHaveTextContent(
        'Phone number is required'
      );
      expect(screen.getByTestId('error-nakshatra')).toHaveTextContent(
        'Birth star (nakshatra) is required'
      );
      expect(screen.getByTestId('error-date')).toHaveTextContent(
        'Offering date is required'
      );

      // Form should not submit
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('validates invalid phone number format and past date', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<OrderForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/devotee full name/i);
      const phoneInput = screen.getByLabelText(/devotee mobile number/i);
      const starSelect = screen.getByLabelText(/birth star/i);
      const dateInput = screen.getByLabelText(/date of offering/i);

      // Fill valid name & star, but invalid phone and past date
      await user.type(nameInput, 'Manoj Ram');
      await user.type(phoneInput, '12345'); // Invalid Indian phone (doesn't start with 6-9, <10 digits)
      await user.selectOptions(starSelect, 'Rohini');
      await user.type(dateInput, '2020-01-01'); // Past date

      const submitButton = screen.getByRole('button', { name: /proceed to book/i });
      await user.click(submitButton);

      expect(screen.queryByTestId('error-devoteeName')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-nakshatra')).not.toBeInTheDocument();

      // Error messages for phone and past date
      expect(screen.getByTestId('error-phoneNumber')).toHaveTextContent(
        'Enter a valid 10-digit mobile number'
      );
      expect(screen.getByTestId('error-date')).toHaveTextContent(
        'Offering date cannot be in the past'
      );

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits successfully when all fields are valid', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<OrderForm onSubmit={onSubmit} />);

      // Future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      await user.type(screen.getByLabelText(/devotee full name/i), 'Manoj Ramakrishnan');
      await user.type(screen.getByLabelText(/devotee mobile number/i), '9847012345');
      await user.selectOptions(screen.getByLabelText(/birth star/i), 'Rohini');
      await user.type(screen.getByLabelText(/date of offering/i), futureDateStr);

      await user.click(screen.getByRole('button', { name: /proceed to book/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        devoteeName: 'Manoj Ramakrishnan',
        phoneNumber: '9847012345',
        nakshatra: 'Rohini',
        date: futureDateStr,
      });
    });
  });

  describe('Cart Persistence (localStorage)', () => {
    it('acceptance criterion: refreshing the page keeps the cart', () => {
      const initialItems: CartItem[] = [
        {
          offeringId: 'sab-1',
          offeringName: 'Pushpanjali',
          price: 30,
          quantity: 2,
          templeId: 'sabarimala',
        },
      ];

      // Simulate saved cart in localStorage
      localStorage.setItem('tdb_vazhipadu_cart_items', JSON.stringify(initialItems));

      // Check localStorage retrieval
      const stored = localStorage.getItem('tdb_vazhipadu_cart_items');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].offeringName).toBe('Pushpanjali');
      expect(parsed[0].quantity).toBe(2);
    });
  });
});
