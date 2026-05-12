/* eslint-disable @typescript-eslint/no-unused-vars */
export {};
// ============================================
// Exercise: Blog App Schemas
// ============================================
// Run from santa-notifications/:  npx ts-node --transpile-only exercises/07-mongodb-and-mongoose/blog-schema.ts
// Requires: MongoDB 7.x running on localhost:27017

import mongoose, { Schema, model, Types } from 'mongoose';

// ============================================
// TODO 1: Define the IUser interface
// ============================================
// Fields:
//   - firstName: string (required)
//   - lastName: string (required)
//   - email: string (required, unique)
//   - bio: string (optional, max 500 chars)
//   - role: 'author' | 'editor' | 'reader' (default: 'reader')
//   - createdAt: Date
//   - updatedAt: Date

// Your interface here:
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role: 'author' | 'editor' | 'reader';
  createdAt: Date;
  updatedAt: Date;
  // instance method
  isAuthor(): boolean;
}

// ============================================
// TODO 2: Define the userSchema
// ============================================
// Requirements:
//   - Add validation: required fields, email format, bio maxlength
//   - Add timestamps: true
//   - Add a virtual "fullName" that returns "firstName lastName"
//   - Add an instance method "isAuthor()" that returns true if role is 'author'
//   - Add a toJSON transform that: renames _id to id, removes __v
//   - Add a unique index on email
//   - Add a text index on firstName + lastName (for search)

// Your schema here:
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    bio: { type: String, maxlength: 500 },
    role: {
      type: String,
      enum: ['author', 'editor', 'reader'],
      default: 'reader',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
      },
    },
  }
);

userSchema.virtual('fullName').get(function (
  this: IUser & { firstName: string; lastName: string }
) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.isAuthor = function (): boolean {
  return this.role === 'author';
};

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firstName: 'text', lastName: 'text' });

// ============================================
// TODO 3: Define the IPost interface
// ============================================
// Fields:
//   - title: string (required, min 5 chars, max 200 chars)
//   - slug: string (required, unique — URL-friendly version of title)
//   - content: string (required)
//   - excerpt: string (optional, max 300 chars)
//   - authorId: ObjectId reference to User (required)
//   - status: 'draft' | 'published' | 'archived' (default: 'draft')
//   - tags: string[] (default: [])
//   - viewCount: number (default: 0)
//   - publishedAt: Date (optional)
//   - createdAt: Date
//   - updatedAt: Date

// Your interface here:
interface IPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TODO 4: Define the postSchema
// ============================================
// Requirements:
//   - Add all validations from the interface above
//   - Add timestamps: true
//   - Add a hook that auto-generates slug from title (lowercase, replace spaces
//     with dashes, remove non-alphanumeric chars except dashes) — but ONLY if
//     title is modified and slug is not set
//   - Add indexes: unique on slug, compound on { authorId: 1, createdAt: -1 },
//     text index on { title: 'text', content: 'text' }
//
//   IMPORTANT: use `pre('validate')`, NOT `pre('save')`.
//   Mongoose runs schema validation BEFORE save hooks, so a pre-save hook
//   would fire too late — the `slug: required: true` check would fail
//   with a ValidationError. The `pre('validate')` hook runs early enough
//   to populate the slug before validation.

// Your schema here:
const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, minlength: 5, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    tags: { type: [String], default: [] },
    viewCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

postSchema.pre('validate', async function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ title: 'text', content: 'text' });

// ============================================
// TODO 5: Define the IComment interface
// ============================================
// Fields:
//   - postId: ObjectId reference to Post (required)
//   - authorId: ObjectId reference to User (required)
//   - content: string (required, min 1 char, max 2000 chars)
//   - parentCommentId: ObjectId reference to Comment (optional — for nested replies)
//   - likes: number (default: 0)
//   - createdAt: Date
//   - updatedAt: Date

// Your interface here:
interface IComment {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  parentCommentId?: Types.ObjectId;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TODO 6: Define the commentSchema
// ============================================
// Requirements:
//   - Add all validations from the interface above
//   - Add timestamps: true
//   - Add indexes: compound on { postId: 1, createdAt: 1 } (for listing comments on a post),
//     single on { authorId: 1 }

// Your schema here:
const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 2000 },
    parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ authorId: 1 });

// ============================================
// TODO 7: Compile models and test
// ============================================
// Create the User, Post, and Comment models.
// Then in the main() function below:
//   1. Create 2 users
//   2. Create 2 posts (one by each user)
//   3. Create 3 comments on the first post (one should be a reply to another)
//   4. Use populate to fetch a post with its author
//   5. Use populate to fetch comments with their authors
//   6. Console.log all results

const User = model<IUser>('User', userSchema);
const Post = model<IPost>('Post', postSchema);
const Comment = model<IComment>('Comment', commentSchema);

async function main(): Promise<void> {
  await mongoose.connect('mongodb://localhost:27017/blog-exercise');
  console.log('=== Blog Schema Exercise ===\n');

  // Clean up
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  // 1. Create 2 users
  const alice = await User.create({
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    bio: 'Tech writer and coffee enthusiast.',
    role: 'author',
  });

  const bob = await User.create({
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    role: 'editor',
  });

  console.log('Users created:');
  console.log(alice.toJSON());
  console.log(bob.toJSON());
  console.log(`Alice isAuthor: ${alice.isAuthor()}`);
  console.log(`Bob isAuthor: ${bob.isAuthor()}\n`);

  // 2. Create 2 posts (one by each user)
  const post1 = await Post.create({
    title: 'Hello World from Alice',
    content: "This is the full content of Alice's first post.",
    authorId: alice._id,
    status: 'published',
    tags: ['intro', 'hello'],
  });

  const post2 = await Post.create({
    title: 'Bob Writes About Editing',
    content: 'Bob shares his tips on editing great content.',
    authorId: bob._id,
    tags: ['editing', 'tips'],
  });

  console.log('Posts created:');
  console.log(post1.toJSON ? post1.toJSON() : post1);
  console.log(post2.toJSON ? post2.toJSON() : post2);

  // 3. Create 3 comments on the first post (one is a reply to another)
  const comment1 = await Comment.create({
    postId: post1._id,
    authorId: bob._id,
    content: 'Great post, Alice!',
  });

  const comment2 = await Comment.create({
    postId: post1._id,
    authorId: alice._id,
    content: 'Thanks Bob, glad you enjoyed it!',
    parentCommentId: comment1._id,
  });

  const comment3 = await Comment.create({
    postId: post1._id,
    authorId: bob._id,
    content: 'Looking forward to your next one.',
  });

  console.log('\nComments created:');
  console.log(comment1.toJSON ? comment1.toJSON() : comment1);
  console.log(comment2.toJSON ? comment2.toJSON() : comment2);
  console.log(comment3.toJSON ? comment3.toJSON() : comment3);

  // 4. Use populate to fetch a post with its author
  const populatedPost = await Post.findById(post1._id).populate('authorId');
  console.log('\nPost with populated author:');
  console.log(JSON.stringify(populatedPost, null, 2));

  // 5. Use populate to fetch comments with their authors
  const populatedComments = await Comment.find({ postId: post1._id })
    .populate('authorId')
    .sort({ createdAt: 1 });
  console.log('\nComments with populated authors:');
  console.log(JSON.stringify(populatedComments, null, 2));

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(console.error);
