import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OfferingsList } from './OfferingsList';
import * as api from '../api';
import { Offering } from '../types';

const mockOfferings: Offering[] = [
  {
    id: 'off-1',
    templeId: 'sabarimala',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Floral offering with Vedic mantras',
  },
  {
    id: 'off-2',
    templeId: 'sabarimala',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Chanting of holy names',
  },
  {
    id: 'off-3',
    templeId: 'sabarimala',
    name: 'Neyyabhishekam',
    price: 150,
    active: true,
    description: 'Ghee bathing ritual',
  },
  {
    id: 'off-4',
    templeId: 'sabarimala',
    name: 'Udayasthamana Pooja',
    price: 5000,
    active: false, // Inactive offering
    description: 'Full day pooja',
  },
];

describe('OfferingsList Component (P1)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders offerings with prices for the selected temple and excludes inactive offerings', async () => {
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);

    render(<OfferingsList templeId="sabarimala" templeName="Sabarimala Temple" />);

    // Wait for offerings to load
    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    expect(screen.getByText('₹30')).toBeInTheDocument();
    expect(screen.getByText('Archana')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();
    expect(screen.getByText('Neyyabhishekam')).toBeInTheDocument();

    // Requirement: Inactive offerings are not offered for booking
    expect(screen.queryByText('Udayasthamana Pooja')).not.toBeInTheDocument();
  });

  it('acceptance criterion: typing "push" shows Pushpanjali and hides offerings that don\'t match', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);

    render(<OfferingsList templeId="sabarimala" templeName="Sabarimala Temple" />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
      expect(screen.getByText('Archana')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search offerings by name/i });

    // Type "push"
    await user.type(searchInput, 'push');

    // Pushpanjali should be visible
    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();

    // Archana and Neyyabhishekam should be hidden
    expect(screen.queryByText('Archana')).not.toBeInTheDocument();
    expect(screen.queryByText('Neyyabhishekam')).not.toBeInTheDocument();
  });

  it('acceptance criterion: a failed load shows an error with a way to try again', async () => {
    const user = userEvent.setup();
    // First call rejects with network failure
    const getOfferingsSpy = vi
      .spyOn(api, 'getOfferings')
      .mockRejectedValueOnce(new Error('Network error: Server unavailable'))
      .mockResolvedValueOnce(mockOfferings);

    render(<OfferingsList templeId="sabarimala" templeName="Sabarimala Temple" />);

    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Network error: Server unavailable/i)).toBeInTheDocument();

    // Find and click the "Try again" button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);

    // After retry, offerings should load successfully
    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });
    expect(getOfferingsSpy).toHaveBeenCalledTimes(2);
  });

  it('shows empty state when no offerings match search query and allows clearing', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);

    render(<OfferingsList templeId="sabarimala" templeName="Sabarimala Temple" />);

    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search offerings by name/i });
    await user.type(searchInput, 'NonExistentOffering');

    expect(screen.getByText(/No offerings match "NonExistentOffering"/i)).toBeInTheDocument();

    // Click clear search filter
    const clearButton = screen.getByRole('button', { name: /clear search filter/i });
    await user.click(clearButton);

    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    expect(screen.getByText('Archana')).toBeInTheDocument();
  });
});
