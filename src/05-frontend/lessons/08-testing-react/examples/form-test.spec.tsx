// ============================================
// Form Test Example
// ============================================
// Tests a LoginForm component: fill inputs, submit, loading state, error display.
// Demonstrates: userEvent.type, form submission, async assertions, state changes.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { useState } from 'react';

// ---- Component Under Test ----

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <div role="alert">{error}</div>}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

// ---- Tests ----

describe('LoginForm', () => {
  test('renders email and password inputs', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    // Find inputs by their label text (accessible query)
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('calls onSubmit with email and password', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<LoginForm onSubmit={handleSubmit} />);

    // Type into inputs
    await user.type(screen.getByLabelText('Email'), 'alice@test.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Check the handler was called with correct data
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'alice@test.com',
      password: 'secret123',
    });
  });

  test('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    // Create a promise we control to keep the form in loading state
    let resolveSubmit!: () => void;
    const handleSubmit = vi.fn(
      () => new Promise<void>((resolve) => { resolveSubmit = resolve; })
    );

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Button should show loading text and be disabled
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();

    // Resolve the promise to end loading
    resolveSubmit();

    // Button should return to normal
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).not.toBeDisabled();
    });
  });

  test('displays error message on failed login', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'wrong@test.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Error message should appear (role="alert" makes it accessible)
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  test('clears error on new submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn()
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce(undefined);

    render(<LoginForm onSubmit={handleSubmit} />);

    // First attempt — fails
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    // Second attempt — succeeds, error should clear
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
