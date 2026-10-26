import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTemples,
  getOfferings,
  createOrder,
  getOrders,
  cancelOrder,
  configureMockApi,
  resetMockData,
} from './index';

describe('Mock API Module', () => {
  beforeEach(() => {
    resetMockData();
    // Disable random failure & delay for deterministic tests
    configureMockApi({ failureRate: 0, minDelayMs: 0, maxDelayMs: 0 });
  });

  it('retrieves seeded temples correctly', async () => {
    const temples = await getTemples();
    expect(temples.length).toBeGreaterThanOrEqual(2);
    expect(temples.some((t) => t.id === 'sabarimala')).toBe(true);
    expect(temples.some((t) => t.id === 'ambalappuzha')).toBe(true);
  });

  it('retrieves offerings for a given temple including active and inactive flags', async () => {
    const offerings = await getOfferings('sabarimala');
    expect(offerings.length).toBeGreaterThanOrEqual(8);

    const pushpanjali = offerings.find((o) => o.name === 'Pushpanjali');
    expect(pushpanjali).toBeDefined();
    expect(pushpanjali?.price).toBe(30);
    expect(pushpanjali?.active).toBe(true);

    const inactive = offerings.find((o) => !o.active);
    expect(inactive).toBeDefined();
  });

  it('creates an order and returns the generated order details', async () => {
    const newOrder = await createOrder({
      templeId: 'sabarimala',
      devoteeName: 'Devotee Test',
      phoneNumber: '9847012345',
      nakshatra: 'Rohini',
      date: '2026-11-01',
      items: [
        { offeringId: 'sab-1', quantity: 2 }, // 2 * 30 = 60
        { offeringId: 'sab-2', quantity: 1 }, // 1 * 50 = 50
      ],
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.orderNumber).toMatch(/^TDB-2026-\d+$/);
    expect(newOrder.totalAmount).toBe(110);
    expect(newOrder.status).toBe('CONFIRMED');
    expect(newOrder.items).toHaveLength(2);
  });

  it('retrieves orders with pagination and filtering', async () => {
    const response = await getOrders({ page: 1, pageSize: 10, status: 'ALL' });
    expect(response.orders.length).toBe(10);
    expect(response.total).toBeGreaterThanOrEqual(50);
    expect(response.totalPages).toBeGreaterThanOrEqual(5);

    // Filter by status
    const cancelledResponse = await getOrders({ status: 'CANCELLED', pageSize: 50 });
    expect(cancelledResponse.orders.every((o) => o.status === 'CANCELLED')).toBe(true);
  });

  it('cancels an active order and updates its status', async () => {
    const response = await getOrders({ status: 'CONFIRMED', pageSize: 1 });
    const targetOrder = response.orders[0];

    const cancelled = await cancelOrder(targetOrder.id);
    expect(cancelled.status).toBe('CANCELLED');

    // Confirm it throws when cancelling again
    await expect(cancelOrder(targetOrder.id)).rejects.toThrow('already cancelled');
  });

  it('fails with network error when failureRate is 100%', async () => {
    configureMockApi({ failureRate: 1, minDelayMs: 0, maxDelayMs: 0 });
    await expect(getTemples()).rejects.toThrow('Network error');
  });
});
