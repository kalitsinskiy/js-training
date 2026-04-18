// ============================================
// Form Submission Example
// ============================================
// Demonstrates:
// - Form with controlled inputs
// - Submit handler with loading state
// - Button disabled while loading
// - Validation errors from API
// - Success redirect (simulated)
// - Error display

import { useState } from 'react';

// ---- Types ----

interface Room {
  id: string;
  name: string;
  code: string;
}

interface ValidationErrors {
  [field: string]: string;
}

// ---- Fake API (replace with real api.post in a real app) ----

async function createRoom(data: { name: string; maxMembers: number }): Promise<Room> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate validation error
  if (data.name.length < 3) {
    const error: any = new Error('Validation failed');
    error.status = 400;
    error.validationErrors = { name: 'Room name must be at least 3 characters' };
    throw error;
  }

  // Simulate server error
  if (data.name.toLowerCase() === 'error') {
    throw new Error('Internal server error');
  }

  // Success
  return {
    id: crypto.randomUUID(),
    name: data.name,
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
  };
}

// ---- Create Room Form ----

function CreateRoomForm() {
  // Form state
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState(10);

  // Async state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors: ValidationErrors = {};
    if (!name.trim()) errors.name = 'Room name is required';
    if (maxMembers < 2) errors.maxMembers = 'Must have at least 2 members';
    if (maxMembers > 50) errors.maxMembers = 'Maximum 50 members';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Clear previous errors
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const room = await createRoom({ name: name.trim(), maxMembers });
      setCreatedRoom(room);
      // In a real app: navigate(`/rooms/${room.id}`);
    } catch (err: any) {
      if (err.status === 400 && err.validationErrors) {
        // Server-side validation errors
        setFieldErrors(err.validationErrors);
      } else {
        // General error
        setError(err.message || 'Failed to create room');
      }
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (createdRoom) {
    return (
      <div style={{ padding: 20, backgroundColor: '#e8f5e9', borderRadius: 8 }}>
        <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Room Created!</h3>
        <p>
          <strong>{createdRoom.name}</strong> — Invite code: <code>{createdRoom.code}</code>
        </p>
        <button
          onClick={() => {
            setCreatedRoom(null);
            setName('');
            setMaxMembers(10);
          }}
          style={{ padding: '8px 16px' }}
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Create Room</h2>

      {/* General error */}
      {error && (
        <div style={{ padding: 12, backgroundColor: '#fdecea', borderRadius: 4, marginBottom: 16, color: '#d32f2f' }}>
          {error}
        </div>
      )}

      {/* Room Name */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Room Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Office Party"
          disabled={loading}
          style={{
            width: '100%',
            padding: 8,
            border: fieldErrors.name ? '2px solid #d32f2f' : '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        {fieldErrors.name && (
          <p style={{ color: '#d32f2f', fontSize: 12, margin: '4px 0 0' }}>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Max Members */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Max Members
        </label>
        <input
          type="number"
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
          min={2}
          max={50}
          disabled={loading}
          style={{
            width: '100%',
            padding: 8,
            border: fieldErrors.maxMembers ? '2px solid #d32f2f' : '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        {fieldErrors.maxMembers && (
          <p style={{ color: '#d32f2f', fontSize: 12, margin: '4px 0 0' }}>
            {fieldErrors.maxMembers}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 16,
          width: '100%',
        }}
      >
        {loading ? 'Creating...' : 'Create Room'}
      </button>

      <p style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
        Tip: enter "error" as room name to see the error state. Enter 1-2 chars to see validation.
      </p>
    </form>
  );
}

// ---- App ----

export default function FormSubmissionApp() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 500, margin: '0 auto' }}>
      <h1>Form Submission Example</h1>
      <CreateRoomForm />
    </div>
  );
}
