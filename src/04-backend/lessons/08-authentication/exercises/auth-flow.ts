export {};
// ============================================
// Exercise: Authentication Flow
// ============================================
// Run: npx ts-node src/04-backend/lessons/08-authentication/exercises/auth-flow.ts
// Install: npm install bcrypt jsonwebtoken
// Types: npm install -D @types/bcrypt @types/jsonwebtoken

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// These imports and variables are used in TODO implementations below
void bcrypt; void jwt;

// --- Simulated database ---

interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: 'user' | 'admin';
}

const users = new Map<string, User>();
let nextId = 1;

const JWT_SECRET = 'exercise-secret-key';
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 10;

// These variables are used in TODO implementations below
void users; void nextId; void JWT_SECRET; void JWT_EXPIRES_IN; void SALT_ROUNDS;

// ============================================
// TODO 1: Implement the register function
// ============================================
// Steps:
//   1. Check if a user with the given email already exists — if yes, throw an Error('Email already registered')
//   2. Hash the password using bcrypt with SALT_ROUNDS
//   3. Create a user object with a generated id, the email (lowercased), the hash, displayName, and role 'user'
//   4. Store the user in the users Map (key = email)
//   5. Generate a JWT token with payload: { sub: user.id, email: user.email, role: user.role }
//      Use JWT_SECRET and { expiresIn: JWT_EXPIRES_IN }
//   6. Return { user: { id, email, displayName, role }, accessToken }
//      (never return the passwordHash!)

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

interface AuthResult {
  user: { id: string; email: string; displayName: string; role: string };
  accessToken: string;
}

async function register(_input: RegisterInput): Promise<AuthResult> {
  // TODO: Rename _input back to input and implement this function
  throw new Error('Not implemented');
}

// ============================================
// TODO 2: Implement the login function
// ============================================
// Steps:
//   1. Find the user by email (lowercased) — if not found, throw Error('Invalid credentials')
//   2. Compare the provided password with the stored passwordHash using bcrypt
//      If the password is wrong, throw Error('Invalid credentials')
//      (Use the same error message for both "user not found" and "wrong password"
//       to avoid leaking info about which emails are registered)
//   3. Generate a JWT token with the same payload as in register
//   4. Return { user: { id, email, displayName, role }, accessToken }

interface LoginInput {
  email: string;
  password: string;
}

async function login(_input: LoginInput): Promise<AuthResult> {
  // TODO: Rename _input back to input and implement this function
  throw new Error('Not implemented');
}

// ============================================
// TODO 3: Implement the verifyToken function
// ============================================
// Steps:
//   1. Use jwt.verify() to verify and decode the token
//   2. Return the decoded payload as { id: string, email: string, role: string }
//      (map 'sub' claim to 'id')
//   3. If verification fails, throw Error('Invalid or expired token')

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

function verifyToken(_token: string): TokenPayload {
  // TODO: Rename _token back to token and implement this function
  throw new Error('Not implemented');
}

// ============================================
// TODO 4: Implement the changePassword function
// ============================================
// Steps:
//   1. Find the user by email
//   2. Verify the old password matches using bcrypt
//   3. Hash the new password
//   4. Update the user's passwordHash in the store
//   5. Return true on success
//   Throw appropriate errors if user not found or old password is wrong.

async function changePassword(
  _email: string,
  _oldPassword: string,
  _newPassword: string,
): Promise<boolean> {
  // TODO: Rename parameters (remove _ prefix) and implement this function
  throw new Error('Not implemented');
}

// --- Test your implementations ---

async function main(): Promise<void> {
  console.log('=== Auth Flow Exercise ===\n');

  // Test register
  console.log('--- Register ---');
  try {
    const result1 = await register({
      email: 'Alice@Example.com',
      password: 'AlicePass123!',
      displayName: 'Alice',
    });
    console.log('Registered:', result1.user);
    console.log('Token received:', result1.accessToken.substring(0, 30) + '...');
  } catch (err: any) {
    console.error('Register failed:', err.message);
  }

  // Test duplicate registration
  console.log('\n--- Duplicate register ---');
  try {
    await register({
      email: 'alice@example.com',
      password: 'AnotherPass',
      displayName: 'Alice2',
    });
    console.error('ERROR: Should have thrown');
  } catch (err: any) {
    console.log('Correctly rejected:', err.message);
  }

  // Test login
  console.log('\n--- Login ---');
  try {
    const result2 = await login({
      email: 'alice@example.com',
      password: 'AlicePass123!',
    });
    console.log('Logged in:', result2.user);

    // Verify the token
    console.log('\n--- Verify Token ---');
    const payload = verifyToken(result2.accessToken);
    console.log('Token payload:', payload);
  } catch (err: any) {
    console.error('Login failed:', err.message);
  }

  // Test wrong password
  console.log('\n--- Wrong password ---');
  try {
    await login({ email: 'alice@example.com', password: 'WrongPassword' });
    console.error('ERROR: Should have thrown');
  } catch (err: any) {
    console.log('Correctly rejected:', err.message);
  }

  // Test invalid token
  console.log('\n--- Invalid token ---');
  try {
    verifyToken('invalid.token.here');
    console.error('ERROR: Should have thrown');
  } catch (err: any) {
    console.log('Correctly rejected:', err.message);
  }

  // Test change password
  console.log('\n--- Change Password ---');
  try {
    await changePassword('alice@example.com', 'AlicePass123!', 'NewPassword456!');
    console.log('Password changed successfully');

    // Old password should no longer work
    try {
      await login({ email: 'alice@example.com', password: 'AlicePass123!' });
      console.error('ERROR: Old password should not work');
    } catch {
      console.log('Old password correctly rejected');
    }

    // New password should work
    const result3 = await login({ email: 'alice@example.com', password: 'NewPassword456!' });
    console.log('Login with new password:', result3.user.email);
  } catch (err: any) {
    console.error('Change password failed:', err.message);
  }

  console.log('\nDone.');
}

main().catch(console.error);
