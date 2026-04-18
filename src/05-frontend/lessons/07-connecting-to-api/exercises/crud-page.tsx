// ============================================
// Exercise: CRUD Page
// ============================================
//
// Build a page that performs full CRUD operations against an API:
// - List items (GET)
// - Create item (POST via form)
// - Edit item (PUT)
// - Delete item (DELETE)
//
// Requirements:
// 1. Show a loading spinner while fetching the list
// 2. Show an error message with a retry button if fetch fails
// 3. Show an empty state if no items exist
// 4. Create form: input + submit button, disable while loading, show error on failure
// 5. Edit: inline edit or modal — your choice
// 6. Delete: confirm before deleting, show loading state
// 7. All operations should refresh the list on success
//
// For this exercise, use the fake API functions below (they simulate network delay).
// In a real app, you would replace them with your api.get/post/put/delete calls.

import { useState, useEffect, useCallback } from 'react';

// ---- Types ----

interface WishlistItem {
  id: string;
  title: string;
  url?: string;
  createdAt: string;
}

// ---- Fake API (do NOT modify) ----

let fakeDb: WishlistItem[] = [
  { id: '1', title: 'Warm wool socks', createdAt: '2025-12-01' },
  { id: '2', title: 'Coffee table book', url: 'https://example.com/book', createdAt: '2025-12-02' },
  { id: '3', title: 'Wireless charger', url: 'https://example.com/charger', createdAt: '2025-12-03' },
];

const delay = () => new Promise((r) => setTimeout(r, 800));

const fakeApi = {
  async getItems(): Promise<WishlistItem[]> {
    await delay();
    return [...fakeDb];
  },

  async createItem(data: { title: string; url?: string }): Promise<WishlistItem> {
    await delay();
    if (!data.title.trim()) throw new Error('Title is required');
    const item: WishlistItem = {
      id: String(Date.now()),
      title: data.title.trim(),
      url: data.url?.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    fakeDb.push(item);
    return item;
  },

  async updateItem(id: string, data: { title: string; url?: string }): Promise<WishlistItem> {
    await delay();
    if (!data.title.trim()) throw new Error('Title is required');
    const index = fakeDb.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Item not found');
    fakeDb[index] = { ...fakeDb[index], title: data.title.trim(), url: data.url?.trim() || undefined };
    return fakeDb[index];
  },

  async deleteItem(id: string): Promise<void> {
    await delay();
    const index = fakeDb.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Item not found');
    fakeDb.splice(index, 1);
  },
};

// ---- TODO 1: Create the item list display ----
// - Accept items as props
// - Render each item with title, url (if present), and created date
// - Each item should have Edit and Delete buttons
// - Edit button should switch the item to edit mode (inline input)
// - Delete button should call the delete handler
// - Show a loading indicator on the item being deleted

// ---- TODO 2: Create the "Add Item" form ----
// - Input for title (required)
// - Input for URL (optional)
// - Submit button — disabled while loading
// - Show error message if creation fails
// - Clear form on success

// ---- TODO 3: Create the main CrudPage component ----
// - Fetch items on mount using fakeApi.getItems()
// - Track loading, error, and items state
// - Handle create: call fakeApi.createItem, refresh list
// - Handle update: call fakeApi.updateItem, refresh list
// - Handle delete: confirm with window.confirm, call fakeApi.deleteItem, refresh list
// - Show appropriate UI for each state:
//   - Loading: "Loading wishlist..." with spinner
//   - Error: error message with "Try Again" button
//   - Empty: "No items yet. Add your first wish!"
//   - Data: list of items + create form

function CrudPage() {
  // TODO: Implement

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>My Wishlist</h1>
      <p>TODO: implement CRUD operations</p>
    </div>
  );
}

export default CrudPage;
