// ============================================
// Exercise: ItemList Tests
// ============================================
//
// Write tests for the ItemList component defined below.
// The component:
// - Fetches items on mount via the provided fetchItems prop
// - Shows "Loading..." while fetching
// - Shows an error message (role="alert") with a "Retry" button on failure
// - Shows "No items yet." when the list is empty
// - Renders each item's name and description
// - Has a "Delete" button per item that calls onDelete(id)
//
// Requirements — implement each test marked TODO:
// 1. Shows loading state on mount
// 2. Renders items after successful fetch
// 3. Shows empty state when fetch returns []
// 4. Shows error message on fetch failure
// 5. Retry button re-calls fetchItems
// 6. Delete button calls onDelete with the correct item id
//
// Hints:
// - Use vi.fn() for fetchItems and onDelete
// - Use mockResolvedValue / mockRejectedValue
// - Use findByText / findByRole for async state transitions
// - Use queryByText to assert something is NOT rendered
// - Use within() from @testing-library/react if needed to scope queries

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useState, useEffect, useCallback } from 'react';

// ---- Types ----

interface Item {
  id: string;
  name: string;
  description: string;
}

// ---- Component Under Test (do NOT modify) ----

interface ItemListProps {
  fetchItems: () => Promise<Item[]>;
  onDelete: (id: string) => Promise<void>;
}

function ItemList({ fetchItems, onDelete }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={loadItems}>Retry</button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p>No items yet.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
          <span>{item.description}</span>
          <button
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? 'Deleting...' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---- Sample data for tests ----

const sampleItems: Item[] = [
  { id: '1', name: 'Warm socks', description: 'Wool, size M' },
  { id: '2', name: 'Coffee mug', description: 'Ceramic, 350ml' },
  { id: '3', name: 'Book', description: 'Clean Code by Robert Martin' },
];

// ---- Tests ----

describe('ItemList', () => {
  // TODO 1: Test loading state
  // - Provide a fetchItems that returns a never-resolving promise
  //   Hint: vi.fn(() => new Promise(() => {}))
  // - Render ItemList
  // - Assert that "Loading..." text is visible
  test('shows loading state on mount', () => {
    // TODO: Implement
  });

  // TODO 2: Test successful data rendering
  // - Mock fetchItems to resolve with sampleItems
  // - Render ItemList
  // - Wait for items to appear (use findByText)
  // - Assert each item name is in the document
  // - Assert "Loading..." is no longer present
  test('renders items after successful fetch', async () => {
    // TODO: Implement
  });

  // TODO 3: Test empty state
  // - Mock fetchItems to resolve with an empty array
  // - Render ItemList
  // - Wait for and assert "No items yet." text appears
  test('shows empty state when no items', async () => {
    // TODO: Implement
  });

  // TODO 4: Test error state
  // - Mock fetchItems to reject with Error('Server error')
  // - Render ItemList
  // - Wait for the error alert to appear
  // - Assert it contains the error message
  // - Assert a "Retry" button is present
  test('shows error message on fetch failure', async () => {
    // TODO: Implement
  });

  // TODO 5: Test retry after error
  // - Mock fetchItems to fail first, then succeed with sampleItems
  //   Hint: mockRejectedValueOnce then mockResolvedValueOnce
  // - Render, wait for error
  // - Click "Retry" button
  // - Wait for items to appear
  // - Assert error is gone
  // - Assert fetchItems was called twice
  test('retry button refetches items after error', async () => {
    // TODO: Implement
  });

  // TODO 6: Test delete functionality
  // - Mock fetchItems to resolve with sampleItems
  // - Mock onDelete to resolve successfully
  // - Render, wait for items
  // - Find all "Delete" buttons (getAllByRole('button', { name: 'Delete' }))
  // - Click the first Delete button
  // - Assert onDelete was called with the correct item id ('1')
  // - Assert the deleted item is removed from the list
  test('calls onDelete with correct id and removes item', async () => {
    // TODO: Implement
  });
});
