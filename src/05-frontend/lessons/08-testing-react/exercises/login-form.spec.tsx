// ============================================
// Exercise: LoginForm Tests
// ============================================
//
// Write tests for the LoginForm component defined below.
// The component has:
// - Email and Password inputs (with labels)
// - A "Sign In" submit button
// - Loading state: button shows "Signing in..." and is disabled
// - Error display: shows error message in an alert role element
// - Calls onSubmit with { email, password } on form submission
//
// Requirements — implement each test marked TODO:
// 1. Renders email input, password input, and submit button
// 2. Calls onSubmit with correct data when form is filled and submitted
// 3. Shows loading state (button text changes, button disabled) during submission
// 4. Displays error message when onSubmit rejects
// 5. Clears previous error when form is resubmitted
// 6. Does not call onSubmit if email is empty (HTML required validation)
//
// Hints:
// - Use userEvent.setup() for interactions
// - Use vi.fn().mockResolvedValue / mockRejectedValue for the onSubmit mock
// - Use screen.getByLabelText for form inputs
// - Use screen.getByRole('button', { name: ... }) for buttons
// - Use screen.findByRole('alert') for async error appearance
// - Use waitFor for assertions that need to wait for state updates

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { useState } from 'react';

// ---- Component Under Test (do NOT modify) ----

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
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
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
  // TODO 1: Test that the form renders all required elements
  // - Email input (find by label "Email")
  // - Password input (find by label "Password")
  // - Submit button with text "Sign In"
  // - No error message initially (queryByRole('alert') should be null)
  test('renders email input, password input, and submit button', () => {
    // TODO: Implement
  });

  // TODO 2: Test successful form submission
  // - Create a mock onSubmit that resolves successfully
  // - Type an email into the email input
  // - Type a password into the password input
  // - Click the submit button
  // - Assert that onSubmit was called once with { email, password }
  test('calls onSubmit with email and password on submit', async () => {
    // TODO: Implement
  });

  // TODO 3: Test loading state during submission
  // - Create a mock onSubmit that returns a pending promise (never resolves immediately)
  //   Hint: vi.fn(() => new Promise<void>((resolve) => { resolveSubmit = resolve; }))
  // - Fill in the form and submit
  // - Assert the button text changes to "Signing in..."
  // - Assert the button is disabled
  // - Resolve the promise
  // - Assert the button returns to "Sign In" and is enabled
  test('shows loading state while submitting', async () => {
    // TODO: Implement
  });

  // TODO 4: Test error display on failed submission
  // - Create a mock onSubmit that rejects with Error('Invalid credentials')
  // - Fill in the form and submit
  // - Wait for the error alert to appear (findByRole('alert'))
  // - Assert it contains the error message text
  // - Assert the button is re-enabled after the error
  test('displays error message when login fails', async () => {
    // TODO: Implement
  });

  // TODO 5: Test that error clears on retry
  // - Create a mock that fails on first call, succeeds on second
  //   Hint: mockRejectedValueOnce then mockResolvedValueOnce
  // - Submit the form — error should appear
  // - Submit again — error should disappear
  test('clears error when form is resubmitted', async () => {
    // TODO: Implement
  });

  // TODO 6: Test that the submit button is not disabled by default
  // - Render the form
  // - Assert the button is NOT disabled
  test('submit button is enabled by default', () => {
    // TODO: Implement
  });
});
