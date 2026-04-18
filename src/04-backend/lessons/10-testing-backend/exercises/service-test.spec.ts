// ============================================
// Exercise: Unit Tests for UserService
// ============================================
// Run: npx jest src/04-backend/lessons/10-testing-backend/exercises/service-test.spec.ts

// --- The service to test (given to you) ---

interface User {
  _id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
}

interface UserModel {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findOne(filter: Record<string, any>): Promise<User | null>;
  findByIdAndUpdate(id: string, data: Partial<User>, options?: any): Promise<User | null>;
  findByIdAndDelete(id: string): Promise<User | null>;
  countDocuments(filter?: Record<string, any>): Promise<number>;
}

class UserService {
  constructor(private readonly userModel: UserModel) {}

  async create(email: string, displayName: string, passwordHash: string): Promise<User> {
    const existing = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new Error('Email already registered');
    }

    return this.userModel.create({
      email: email.toLowerCase(),
      displayName,
      passwordHash,
      role: 'user',
      isActive: true,
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async updateProfile(id: string, data: { displayName?: string; email?: string }): Promise<User> {
    if (data.displayName !== undefined && data.displayName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }

    if (data.email) {
      const existing = await this.userModel.findOne({ email: data.email.toLowerCase() });
      if (existing && existing._id !== id) {
        throw new Error('Email already in use');
      }
      data.email = data.email.toLowerCase();
    }

    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getStats(): Promise<{ total: number; active: number; admins: number }> {
    const [total, active, admins] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: 'admin' }),
    ]);
    return { total, active, admins };
  }
}

// --- Your tests ---

describe('UserService', () => {
  let service: UserService;
  let mockModel: jest.Mocked<UserModel>;

  // Helper: create a mock user object
  function mockUser(overrides: Partial<User> = {}): User {
    return {
      _id: 'user-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      passwordHash: '$2b$10$hashed',
      role: 'user',
      isActive: true,
      createdAt: new Date('2025-01-01'),
      ...overrides,
    };
  }

  // Placeholder to ensure the test suite can run before TODOs are implemented
  it('should have a mockUser helper', () => {
    const user = mockUser();
    expect(user._id).toBe('user-1');
  });

  beforeEach(() => {
    // TODO: Create mock model with jest.fn() for each method
    // Hint: mockModel = { create: jest.fn(), findById: jest.fn(), ... }

    // TODO: Instantiate UserService with the mock model
  });

  // ============================================
  // TODO 1: Test the create method
  // ============================================
  describe('create', () => {
    // TODO: Write a test that verifies:
    //   - create() calls findOne to check for duplicate email
    //   - create() calls userModel.create with lowercase email, displayName, passwordHash, role: 'user', isActive: true
    //   - create() returns the created user

    // TODO: Write a test that verifies:
    //   - If findOne returns an existing user, create() throws 'Email already registered'
    //   - userModel.create is NOT called

    // TODO: Write a test that verifies email is lowercased:
    //   - Calling create('ALICE@EXAMPLE.COM', ...) should store 'alice@example.com'
  });

  // ============================================
  // TODO 2: Test the findById method
  // ============================================
  describe('findById', () => {
    // TODO: Write a test that returns the user when found and active

    // TODO: Write a test that throws 'User not found' when findById returns null

    // TODO: Write a test that throws 'User account is deactivated' when the user exists but isActive is false
  });

  // ============================================
  // TODO 3: Test the updateProfile method
  // ============================================
  describe('updateProfile', () => {
    // TODO: Write a test that successfully updates displayName

    // TODO: Write a test that throws 'Display name must be at least 2 characters'
    //   when displayName is too short (e.g., 'A')

    // TODO: Write a test that successfully updates email (lowercased)

    // TODO: Write a test that throws 'Email already in use' when the new email
    //   belongs to a different user (findOne returns a user with a different _id)

    // TODO: Write a test that throws 'User not found' when findByIdAndUpdate returns null
  });

  // ============================================
  // TODO 4: Test the deactivate method
  // ============================================
  describe('deactivate', () => {
    // TODO: Write a test that deactivates a user (sets isActive to false)

    // TODO: Write a test that throws 'User not found' when the user doesn't exist
  });

  // ============================================
  // TODO 5: Test the getStats method
  // ============================================
  describe('getStats', () => {
    // TODO: Write a test that returns correct stats
    //   Mock countDocuments to return different values for different filters:
    //   - No filter -> total
    //   - { isActive: true } -> active count
    //   - { role: 'admin' } -> admin count
    //
    // Hint: Use mockModel.countDocuments.mockImplementation((filter) => { ... })
    //   or use mockResolvedValueOnce for sequential calls
  });
});
