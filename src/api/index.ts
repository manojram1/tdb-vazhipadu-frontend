import {
  Temple,
  Offering,
  Order,
  CreateOrderRequest,
  GetOrdersQuery,
  PaginatedOrdersResponse,
} from '../types';
import { INITIAL_TEMPLES, INITIAL_OFFERINGS, INITIAL_ORDERS } from './mockData';

// In-memory data store
let temples: Temple[] = [...INITIAL_TEMPLES];
let offerings: Offering[] = [...INITIAL_OFFERINGS];
let orders: Order[] = [...INITIAL_ORDERS];

// Configuration
let failureRate = 0.1; // Default 10%
let minDelayMs = 200;
let maxDelayMs = 1000;

/**
 * Configure mock API behavior (useful for testing and deterministic UI checks)
 */
export function configureMockApi(options: {
  failureRate?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
}) {
  if (options.failureRate !== undefined) {
    failureRate = Math.max(0, Math.min(1, options.failureRate));
  }
  if (options.minDelayMs !== undefined) {
    minDelayMs = Math.max(0, options.minDelayMs);
  }
  if (options.maxDelayMs !== undefined) {
    maxDelayMs = Math.max(minDelayMs, options.maxDelayMs);
  }
}

/**
 * Reset mock data to initial seeds (useful for test isolation)
 */
export function resetMockData() {
  temples = [...INITIAL_TEMPLES];
  offerings = [...INITIAL_OFFERINGS];
  orders = [...INITIAL_ORDERS];
  failureRate = 0.1;
  minDelayMs = 200;
  maxDelayMs = 1000;
}

/**
 * Simulate random network latency and failure rate
 */
async function simulateNetwork(): Promise<void> {
  const delay = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (failureRate > 0 && Math.random() < failureRate) {
    throw new Error('Network error: Unable to communicate with the Temple Board server. Please try again.');
  }
}

/**
 * List all temples
 */
export async function getTemples(): Promise<Temple[]> {
  await simulateNetwork();
  return JSON.parse(JSON.stringify(temples));
}

/**
 * List offerings for a specific temple
 */
export async function getOfferings(templeId: string): Promise<Offering[]> {
  await simulateNetwork();
  const templeOfferings = offerings.filter((o) => o.templeId === templeId);
  return JSON.parse(JSON.stringify(templeOfferings));
}

/**
 * Place a new vazhipadu order
 */
export async function createOrder(request: CreateOrderRequest): Promise<Order> {
  await simulateNetwork();

  if (!request.templeId) {
    throw new Error('Validation error: Temple is required');
  }
  if (!request.devoteeName || request.devoteeName.trim().length === 0) {
    throw new Error('Validation error: Devotee name is required');
  }
  if (!request.phoneNumber || !/^[6-9]\d{9}$/.test(request.phoneNumber.trim())) {
    throw new Error('Validation error: Valid 10-digit Indian phone number is required');
  }
  if (!request.nakshatra) {
    throw new Error('Validation error: Nakshatra is required');
  }
  if (!request.date) {
    throw new Error('Validation error: Offering date is required');
  }
  if (!request.items || request.items.length === 0) {
    throw new Error('Validation error: Order must contain at least one offering');
  }

  const temple = temples.find((t) => t.id === request.templeId);
  const itemsWithDetails = request.items.map((item) => {
    const offering = offerings.find((o) => o.id === item.offeringId);
    if (!offering) {
      throw new Error(`Offering with ID ${item.offeringId} not found`);
    }
    if (!offering.active) {
      throw new Error(`Offering ${offering.name} is currently inactive and cannot be booked`);
    }
    if (item.quantity <= 0) {
      throw new Error(`Quantity for ${offering.name} must be at least 1`);
    }
    return {
      offeringId: offering.id,
      offeringName: offering.name,
      price: offering.price,
      quantity: item.quantity,
    };
  });

  const totalAmount = itemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderId = `order-${Date.now()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `TDB-2026-${randomSuffix}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    templeId: request.templeId,
    templeName: temple?.name || 'Temple',
    devoteeName: request.devoteeName.trim(),
    phoneNumber: request.phoneNumber.trim(),
    nakshatra: request.nakshatra,
    date: request.date,
    items: itemsWithDetails,
    totalAmount,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  // Prepend to orders list so newest orders appear first
  orders.unshift(newOrder);

  return JSON.parse(JSON.stringify(newOrder));
}

/**
 * List orders with optional filtering and pagination
 */
export async function getOrders(query: GetOrdersQuery = {}): Promise<PaginatedOrdersResponse> {
  await simulateNetwork();

  const {
    date,
    status = 'ALL',
    phoneNumber,
    page = 1,
    pageSize = 10,
  } = query;

  let filtered = [...orders];

  if (date && date.trim() !== '') {
    filtered = filtered.filter((o) => o.date === date.trim());
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter((o) => o.status === status);
  }

  if (phoneNumber && phoneNumber.trim() !== '') {
    const term = phoneNumber.trim();
    filtered = filtered.filter((o) => o.phoneNumber.includes(term));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filtered.slice(startIndex, endIndex);

  return {
    orders: JSON.parse(JSON.stringify(paginatedOrders)),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

/**
 * Cancel an existing order by ID
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  await simulateNetwork();

  const targetIndex = orders.findIndex((o) => o.id === orderId);
  if (targetIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found`);
  }

  const order = orders[targetIndex];
  if (order.status === 'CANCELLED') {
    throw new Error(`Order ${order.orderNumber} is already cancelled`);
  }

  const updatedOrder: Order = {
    ...order,
    status: 'CANCELLED',
  };

  orders[targetIndex] = updatedOrder;

  return JSON.parse(JSON.stringify(updatedOrder));
}
