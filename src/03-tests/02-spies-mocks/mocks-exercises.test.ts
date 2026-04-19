import { describe, expect, test, jest, beforeEach } from '@jest/globals';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailService } from './email.service';
import { UserService } from './user.service';
import e from 'express';

// ============================================
// EXERCISES — Mocks & Spies
// ============================================

// Exercise 1: Basic jest.fn()
describe('Exercise 1: jest.fn() basics', () => {
  test('callback is called once with correct value', () => {
    function runWithValue(callback: (n: number) => void): void {
      callback(42);
    }

    const mockCallback = jest.fn();

    // TODO: call runWithValue with mockCallback

    // TODO: assert it was called once
    // TODO: assert it was called with 42
  });

  test('mock returns different values on consecutive calls', () => {
    const mockFn = jest.fn();

    // TODO: configure mockFn to return 'first' the first time,
    //       'second' the second time, and 'default' for all subsequent calls
    mockFn.mockReturnValueOnce('first').mockReturnValueOnce('second').mockReturnValue('default');
    // TODO: call mockFn 4 times and assert each return value
    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
    expect(mockFn()).toBe('default');
  });
});

// Exercise 2: spyOn
describe('Exercise 2: jest.spyOn()', () => {
  test('spy on Math.random to control randomness', () => {
    // TODO: spy on Math.random and mock it to return 0.5
    // Hint: jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    // TODO: call Math.random() and verify it returns 0.5
    expect(Math.random()).toBe(0.5);
    // TODO: verify it was called
    expect(randomSpy).toHaveBeenCalled();
    // TODO: restore the original
    randomSpy.mockRestore();
  });

  test('spy on console.log to suppress and verify', () => {
    // TODO: spy on console.log and suppress its output
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // TODO: call console.log('test message')
    console.log('test message');
    // TODO: verify it was called with 'test message'
    expect(logSpy).toHaveBeenCalledWith('test message');
    // TODO: restore the spy
    logSpy.mockRestore();
  });
});

// Exercise 3: Full service test with mocks
describe('Exercise 3: Full service test with mocks', () => {
  let userService: UserService;
  let mockEmailService: jest.Mocked<
    Pick<EmailService, 'sendEmail' | 'sendWelcome' | 'getSentCount'>
  >;
  let mockLogger: { log: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    // TODO: create mockEmailService with all methods as jest.fn()
    //       sendEmail: jest.fn().mockResolvedValue(undefined)
    //       sendWelcome: jest.fn().mockResolvedValue(undefined)
    //       getSentCount: jest.fn().mockReturnValue(0)

    mockEmailService = {
      sendEmail: jest.fn((): Promise<void> => Promise.resolve()),
      sendWelcome: jest.fn((): Promise<void> => Promise.resolve()),
      getSentCount: jest.fn().mockReturnValue(0),
    } as jest.Mocked<Pick<EmailService, 'sendEmail' | 'sendWelcome' | 'getSentCount'>>;

    mockLogger = { log: jest.fn(), error: jest.fn() };

    userService = new UserService(mockEmailService as unknown as EmailService, mockLogger);
  });

  test('register sends welcome email', async () => {
    // TODO: register 'Bob' with 'bob@example.com'
    await userService.register('Bob', 'bob@example.com');

    // TODO: verify sendWelcome was called with the right arguments
    expect(mockEmailService.sendWelcome).toHaveBeenCalledWith('bob@example.com', 'Bob');
    expect(mockLogger.log).toHaveBeenCalledWith('User registered: bob@example.com');
  });

  test('register does not call email on invalid input', async () => {
    // TODO: try to register with invalid email 'bademail'
    await expect(userService.register('Bob', 'bademail')).rejects.toThrow(
      'Invalid email: bademail'
    );
    // TODO: verify it throws
    expect(mockEmailService.sendWelcome).not.toHaveBeenCalled();
    // TODO: verify sendWelcome was NOT called
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  test('deleteUser returns false for missing user', async () => {
    // TODO: delete user with id 'fake-id'
    const result = await userService.deleteUser('fake-id');
    // TODO: verify it returns false
    expect(result).toBe(false);
    // TODO: verify mockLogger.error was called
    expect(mockLogger.error).toHaveBeenCalledWith('User not found: fake-id');
    // TODO: verify mockLogger.log was NOT called
    expect(mockLogger.log).not.toHaveBeenCalled();
  });
});

// Exercise 4: toHaveBeenNthCalledWith
describe('Exercise 4: Call order assertions', () => {
  test('multiple calls in correct order', () => {
    const mockProcess = jest.fn();

    ['item-1', 'item-2', 'item-3'].forEach((item) => mockProcess(item));

    // TODO: verify it was called exactly 3 times
    expect(mockProcess).toHaveBeenCalledTimes(3);
    // TODO: verify the 2nd call was with 'item-2' (use toHaveBeenNthCalledWith)
    expect(mockProcess).toHaveBeenNthCalledWith(2, 'item-2');
    // TODO: verify the last call was with 'item-3' (use toHaveBeenLastCalledWith)
    expect(mockProcess).toHaveBeenLastCalledWith('item-3');
  });
});
