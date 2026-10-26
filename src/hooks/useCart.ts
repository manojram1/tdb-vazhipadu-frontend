import { useState, useEffect, useCallback, useMemo } from 'react';
import { Offering, OrderItem } from '../types';

const CART_STORAGE_KEY = 'tdb_vazhipadu_cart_items';

export interface CartItem extends OrderItem {
  templeId: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addItem = useCallback((offering: Offering) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.offeringId === offering.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prevItems,
        {
          offeringId: offering.id,
          offeringName: offering.name,
          price: offering.price,
          quantity: 1,
          templeId: offering.templeId,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((offeringId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((i) => i.offeringId !== offeringId);
      }
      return prevItems.map((item) =>
        item.offeringId === offeringId ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeItem = useCallback((offeringId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.offeringId !== offeringId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const itemQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.offeringId] = item.quantity;
    }
    return map;
  }, [items]);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalQuantity,
    itemQuantities,
  };
}
