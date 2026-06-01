import { Types } from 'mongoose';

let counter = 0;
const uniq = (): string => `${Date.now()}-${counter++}`;

export interface UserFixture {
  _id: Types.ObjectId;
  email: string;
  displayName: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

export interface RoomFixture {
  _id: Types.ObjectId;
  name: string;
  creatorId: string;
  inviteCode: string;
  participants: string[];
  status: 'pending' | 'drawn';
}

export const userFixture = (
  overrides: Partial<UserFixture> = {},
): UserFixture => ({
  _id: new Types.ObjectId(),
  email: `user-${uniq()}@test.com`,
  displayName: 'Test User',
  passwordHash: '$2b$10$placeholder',
  role: 'user',
  ...overrides,
});

export const roomFixture = (
  overrides: Partial<RoomFixture> = {},
): RoomFixture => ({
  _id: new Types.ObjectId(),
  name: 'Test Room',
  creatorId: new Types.ObjectId().toString(),
  inviteCode: uniq().slice(-6).toUpperCase(),
  participants: [],
  status: 'pending',
  ...overrides,
});
