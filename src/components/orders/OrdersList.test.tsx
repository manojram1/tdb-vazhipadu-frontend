import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrdersList } from './OrdersList';
import * as api from '../../api';
import { Order } from '../../types';

const mockOrdersPage1: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'TDB-2026-1001',
    templeId: 'sabarimala',
    templeName: 'Sabarimala Temple',
    devoteeName: 'Devotee One',
    phoneNumber: '9847012345',
    nakshatra: 'Rohini',
    date: '2026-11-01',
    items: [{ offeringId: 'sab-1', offeringName: 'Pushpanjali', price: 30, quantity: 2 }],
    totalAmount: 60,
    status: 'CONFIRMED',
    createdAt: '2026-10-26T10:00:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'TDB-2026-1002',
    templeId: 'ambalappuzha',
    templeName: 'Ambalappuzha Temple',
    devoteeName: 'Devotee Two',
    phoneNumber: '9847023456',
    nakshatra: 'Aswathy (Ashwini)',
    date: '2026-11-02',
    items: [{ offeringId: 'amb-1', offeringName: 'Paalpayasam', price: 120, quantity: 1 }],
    totalAmount: 120,
    status: 'CONFIRMED',
    createdAt: '2026-10-26T10:05:00Z',
  },
];

const mockCancelledOrders: Order[] = [
  {
    id: 'order-3',
    orderNumber: 'TDB-2026-1003',
    templeId: 'ettumanoor',
    templeName: 'Ettumanoor Mahadeva Temple',
    devoteeName: 'Cancelled Devotee',
    phoneNumber: '9847034567',
    nakshatra: 'Bharani',
    date: '2026-11-03',
    items: [{ offeringId: 'ett-1', offeringName: 'Dhara', price: 100, quantity: 1 }],
    totalAmount: 100,
    status: 'CANCELLED',
    createdAt: '2026-10-26T10:10:00Z',
  },
];

describe('OrdersList Component (P4)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.history.replaceState(null, '', '/');
    }
  });

  it('acceptance criterion: filtering by status shows only matching orders and goes back to page 1', async () => {
    const user = userEvent.setup();

    const getOrdersSpy = vi.spyOn(api, 'getOrders').mockImplementation(async (query = {}) => {
      if (query.status === 'CANCELLED') {
        return {
          orders: mockCancelledOrders,
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        };
      }
      return {
        orders: mockOrdersPage1,
        total: 25,
        page: query.page || 1,
        pageSize: 10,
        totalPages: 3,
      };
    });

    render(<OrdersList />);

    await waitFor(() => {
      expect(screen.getByText('Devotee One')).toBeInTheDocument();
    });

    // Advance to page 2
    const nextBtn = screen.getByTestId('next-page-button');
    await user.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByTestId('page-indicator')).toHaveTextContent(/page 2 of 3/i);
    });

    // Now change status filter to CANCELLED
    const statusSelect = screen.getByTestId('filter-status');
    await user.selectOptions(statusSelect, 'CANCELLED');

    // Should fetch with status CANCELLED and reset page to 1
    await waitFor(() => {
      expect(screen.getByText('Cancelled Devotee')).toBeInTheDocument();
      expect(screen.queryByText('Devotee One')).not.toBeInTheDocument();
    });

    // Verify page went back to 1
    expect(screen.getByTestId('page-indicator')).toHaveTextContent(/page 1 of 1/i);

    expect(getOrdersSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'CANCELLED',
        page: 1,
      })
    );
  });

  it('acceptance criterion: refreshing the page keeps the filters and the current page', async () => {
    // Set up existing URL parameters simulating a refreshed browser tab
    window.history.replaceState(null, '', '/?page=2&status=CONFIRMED&phone=9847');

    const getOrdersSpy = vi.spyOn(api, 'getOrders').mockResolvedValue({
      orders: mockOrdersPage1,
      total: 30,
      page: 2,
      pageSize: 10,
      totalPages: 3,
    });

    render(<OrdersList />);

    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'CONFIRMED',
          phoneNumber: '9847',
          page: 2,
        })
      );
    });

    // Verify UI controls reflect the preserved state
    const statusSelect = screen.getByTestId('filter-status') as HTMLSelectElement;
    const phoneInput = screen.getByTestId('filter-phone') as HTMLInputElement;

    expect(statusSelect.value).toBe('CONFIRMED');
    expect(phoneInput.value).toBe('9847');
    expect(screen.getByTestId('page-indicator')).toHaveTextContent(/page 2 of 3/i);
  });

  it('acceptance criterion: a cancelled order shows as cancelled without reloading the page', async () => {
    const user = userEvent.setup();

    vi.spyOn(api, 'getOrders').mockResolvedValue({
      orders: [...mockOrdersPage1],
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const cancelSpy = vi.spyOn(api, 'cancelOrder').mockResolvedValue({
      ...mockOrdersPage1[0],
      status: 'CANCELLED',
    });

    render(<OrdersList />);

    await waitFor(() => {
      expect(screen.getByText('Devotee One')).toBeInTheDocument();
    });

    // Check initial status is CONFIRMED
    expect(screen.getByTestId('order-status-order-1')).toHaveTextContent('CONFIRMED');

    // Click "Cancel Order" button
    const cancelBtn = screen.getByTestId('cancel-button-order-1');
    await user.click(cancelBtn);

    // Confirmation dialog should be open
    expect(screen.getByTestId('cancel-order-modal')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to cancel vazhipadu booking/i)
    ).toBeInTheDocument();

    // Confirm cancellation
    const confirmBtn = screen.getByTestId('confirm-cancel-button');
    await user.click(confirmBtn);

    // Modal closes and status changes in-place to CANCELLED without page reload
    await waitFor(() => {
      expect(screen.queryByTestId('cancel-order-modal')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('order-status-order-1')).toHaveTextContent('CANCELLED');
    expect(cancelSpy).toHaveBeenCalledWith('order-1');
  });
});
