// ============================================
// API Mock Test Example
// ============================================
// Tests a component that fetches data from an API on mount.
// Demonstrates: vi.mock, mocking resolved/rejected values,
// testing loading/error/success states, waitFor.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useState, useEffect, useCallback } from 'react';

// ---- Fake API module ----
// In a real app, this would be your api service (e.g., '../services/api')

const api = {
  getRooms: vi.fn(),
};

// ---- Component Under Test ----

interface Room {
  id: string;
  name: string;
  memberCount: number;
}

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  if (loading) return <p>Loading rooms...</p>;

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={loadRooms}>Retry</button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return <p>No rooms yet. Create one!</p>;
  }

  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          {room.name} ({room.memberCount} members)
        </li>
      ))}
    </ul>
  );
}

// ---- Tests ----

describe('RoomList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading state initially', () => {
    // API never resolves — keeps component in loading state
    api.getRooms.mockReturnValue(new Promise(() => {}));

    render(<RoomList />);

    expect(screen.getByText('Loading rooms...')).toBeInTheDocument();
  });

  test('renders rooms after successful fetch', async () => {
    api.getRooms.mockResolvedValue([
      { id: '1', name: 'Office Party', memberCount: 8 },
      { id: '2', name: 'Family Exchange', memberCount: 5 },
    ]);

    render(<RoomList />);

    // Wait for loading to finish and rooms to appear
    expect(await screen.findByText(/Office Party/)).toBeInTheDocument();
    expect(screen.getByText(/Family Exchange/)).toBeInTheDocument();

    // Loading should be gone
    expect(screen.queryByText('Loading rooms...')).not.toBeInTheDocument();
  });

  test('shows empty state when no rooms', async () => {
    api.getRooms.mockResolvedValue([]);

    render(<RoomList />);

    expect(await screen.findByText(/No rooms yet/)).toBeInTheDocument();
  });

  test('shows error message on API failure', async () => {
    api.getRooms.mockRejectedValue(new Error('Network error'));

    render(<RoomList />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Network error');
  });

  test('retry button refetches data', async () => {
    const user = userEvent.setup();

    // First call fails
    api.getRooms.mockRejectedValueOnce(new Error('Server error'));

    render(<RoomList />);

    // Wait for error state
    expect(await screen.findByRole('alert')).toHaveTextContent('Server error');

    // Second call succeeds
    api.getRooms.mockResolvedValueOnce([
      { id: '1', name: 'Office Party', memberCount: 8 },
    ]);

    // Click retry
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    // Should show the room now
    expect(await screen.findByText(/Office Party/)).toBeInTheDocument();

    // Error should be gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // API should have been called twice
    expect(api.getRooms).toHaveBeenCalledTimes(2);
  });

  test('shows member count for each room', async () => {
    api.getRooms.mockResolvedValue([
      { id: '1', name: 'Test Room', memberCount: 3 },
    ]);

    render(<RoomList />);

    expect(await screen.findByText('Test Room (3 members)')).toBeInTheDocument();
  });
});
