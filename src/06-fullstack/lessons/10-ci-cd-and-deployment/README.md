# Lesson 10: CI/CD and Deployment

## Quick Overview

Code that is not deployed is not delivering value. This final lesson ties everything together: we add Git hooks (Husky) to catch issues before they reach the remote, enforce conventional commits with commitlint, build a CI pipeline with GitHub Actions, set up managed cloud services (MongoDB Atlas, Redis Cloud, CloudAMQP), and deploy all three applications to the internet.

## Key Concepts

### Git Hooks with Husky

Git hooks are scripts that run automatically at specific points in the Git workflow. **Husky** makes managing them easy:

```bash
# Install Husky
npm install -D husky
npx husky init
```

This creates a `.husky/` directory at the repo root. Add hooks:

```bash
# .husky/pre-commit -- runs before every commit
npm run lint

# .husky/pre-push -- runs before every push
npm run type-check
npm test
```

**How it works:**
- `pre-commit` runs before `git commit` completes. If the script exits with a non-zero code, the commit is aborted.
- `pre-push` runs before `git push`. If it fails, the push is aborted.

```bash
$ git commit -m "feat: add notifications"
> Running pre-commit hook...
> npm run lint
> ✓ Lint passed
> Commit created: abc1234

$ git push
> Running pre-push hook...
> npm run type-check
> ✓ Type check passed
> npm test
> ✓ 42 tests passed
> Pushed to origin/main
```

**Tip**: Use `lint-staged` alongside Husky to only lint files that are staged, not the entire codebase:

```bash
npm install -D lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"],
    "*.{ts,tsx,json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

### Commitlint (Conventional Commits)

Conventional Commits enforce a consistent commit message format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting (no code change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |
| `ci` | CI/CD configuration |
| `perf` | Performance improvement |

```bash
# Good
feat(auth): add JWT refresh token rotation
fix(rooms): prevent duplicate room joins
docs: update API documentation for notifications endpoint
test(messages): add integration tests for anonymous messaging

# Bad
update stuff
fixed bug
WIP
```

Install and configure:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

Now `git commit -m "update stuff"` will be rejected with a helpful error.

### GitHub Actions

GitHub Actions is a CI/CD platform built into GitHub. Workflows are defined in YAML files under `.github/workflows/`.

**Key concepts:**
- **Workflow**: a YAML file triggered by events (push, PR, schedule)
- **Job**: a set of steps that run on the same runner
- **Step**: a single task (run a command, use an action)
- **Matrix**: run the same job with different configurations in parallel
- **Secrets**: encrypted environment variables (set in repo settings)
- **Artifacts**: files produced by a job that can be shared or downloaded

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: [lint, type-check]  # only run if lint + type-check pass
    strategy:
      matrix:
        app: [santa-api, santa-notifications, santa-app]
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379
      rabbitmq:
        image: rabbitmq:3-management
        ports:
          - 5672:5672
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: cd ${{ matrix.app }} && npm ci
      - run: cd ${{ matrix.app }} && npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/${{ matrix.app }}-test
          REDIS_URL: redis://localhost:6379
          RABBITMQ_URL: amqp://localhost:5672
          JWT_SECRET: ci-test-secret
```

**Matrix strategy** runs the test job three times in parallel -- once for each app. This is faster than running them sequentially.

### CI Pipeline Flow

```
  git push / PR opened
        |
        v
  +------------+     +---------------+
  |    Lint     |     |  Type-check   |    (parallel)
  +------------+     +---------------+
        |                   |
        +-------+-----------+
                |
                v
  +----------------------------+
  |         Test               |
  | [santa-api] [santa-notif]  |  (matrix: parallel)
  | [santa-app]                |
  +----------------------------+
                |
                v
  +----------------------------+
  |         Build              |
  +----------------------------+
```

### Deployment Platforms

| Platform | Best for | Free tier | Key features |
|---|---|---|---|
| **Railway** | Backend services | $5 credit/month | Monorepo support, auto-deploy from Git, managed databases |
| **Render** | Backend services | 750 hrs/month | Free web services (spin down after inactivity), managed databases |
| **Fly.io** | Backend with regions | 3 shared VMs free | Global edge deployment, Docker-based |
| **Vercel** | Frontend (React/Next) | Generous free tier | Automatic preview deploys, CDN, zero-config for Vite |
| **Netlify** | Frontend (static/SPA) | 100GB bandwidth/month | Build plugins, form handling, CDN |

**Recommended setup for Secret Santa:**
- **santa-api** + **santa-notifications**: Railway or Render
- **santa-app**: Vercel (best DX for Vite/React)
- **MongoDB**: MongoDB Atlas (free M0 cluster, 512MB)
- **Redis**: Redis Cloud (free tier, 30MB)
- **RabbitMQ**: CloudAMQP (Little Lemur plan, free)

### Managed Services

**MongoDB Atlas** (free tier):

```
1. Go to mongodb.com/atlas
2. Create a free cluster (M0 Sandbox, 512MB)
3. Set up database user (username + password)
4. Whitelist IP addresses (or allow 0.0.0.0/0 for any)
5. Get connection string: mongodb+srv://user:pass@cluster.abc123.mongodb.net/santa-api
```

**Redis Cloud** (free tier):

```
1. Go to redis.com/cloud
2. Create a free database (30MB)
3. Get connection string: redis://default:password@redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com:12345
```

**CloudAMQP** (free tier):

```
1. Go to cloudamqp.com
2. Create a new instance (Little Lemur plan - free)
3. Get AMQP URL: amqps://user:pass@moose.rmq.cloudamqp.com/user
```

### Environment Variables in Production

**Never commit secrets to Git.** Use the deployment platform's environment variable management:

```bash
# Railway (via CLI)
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="strong-random-secret-here"
railway variables set REDIS_URL="redis://..."
railway variables set RABBITMQ_URL="amqps://..."
railway variables set SERVICE_API_KEY="production-service-key"

# Or via the Railway/Render web dashboard: Settings > Environment Variables
```

For santa-app on Vercel:

```bash
# Vercel dashboard: Settings > Environment Variables
VITE_API_URL=https://santa-api-production.railway.app
VITE_NOTIFICATIONS_URL=https://santa-notifications-production.railway.app
```

**Important**: `VITE_` variables are embedded in the client bundle at build time. They are not secret. Only use them for public URLs.

### Health Checks and Monitoring

Add health check endpoints to both backend services:

```typescript
// santa-api health check
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

```typescript
// santa-notifications health check (Fastify)
fastify.get('/health', async () => {
  // Check MongoDB connection
  const mongoOk = mongoose.connection.readyState === 1;

  // Check Redis connection
  let redisOk = false;
  try {
    await redisClient.ping();
    redisOk = true;
  } catch {}

  const status = mongoOk && redisOk ? 'ok' : 'degraded';

  return {
    status,
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoOk ? 'connected' : 'disconnected',
      redis: redisOk ? 'connected' : 'disconnected',
    },
  };
});
```

Configure your deployment platform to ping `/health` every 30 seconds. If it fails, the platform can restart the service.

### Deployment Checklist

Before deploying to production, verify:

- [ ] All tests pass in CI
- [ ] Environment variables are set (no hardcoded secrets)
- [ ] CORS origins are configured for production URLs
- [ ] MongoDB indexes are created
- [ ] Health check endpoint responds
- [ ] Error logging is configured (no `console.log` in production)
- [ ] Rate limiting is enabled on auth endpoints
- [ ] JWT secret is strong and unique per environment
- [ ] `.env` files are in `.gitignore`
- [ ] `NODE_ENV=production` is set

## Task

### Step 1: Add Husky to the Repo

```bash
# From the repo root
npm install -D husky lint-staged
npx husky init
```

Create the pre-commit hook:

```bash
# .husky/pre-commit
npx lint-staged
```

Create the pre-push hook:

```bash
# .husky/pre-push
npm run type-check
npm test -- --run
```

Configure lint-staged in the root `package.json`:

```json
{
  "lint-staged": {
    "santa-api/**/*.ts": ["eslint --fix"],
    "santa-notifications/**/*.ts": ["eslint --fix"],
    "santa-app/**/*.{ts,tsx}": ["eslint --fix"]
  }
}
```

### Step 2: Add Commitlint

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

Create `commitlint.config.js` at the repo root:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf'],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
```

Add the commit-msg hook:

```bash
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

Test it:

```bash
git commit -m "update stuff"
# Should fail: "type must be one of [feat, fix, ...]"

git commit -m "feat: add husky and commitlint"
# Should pass
```

### Step 3: Create GitHub Actions CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 20

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - name: Install dependencies
        run: |
          cd santa-api && npm ci
          cd ../santa-notifications && npm ci
          cd ../santa-app && npm ci
      - name: Lint
        run: |
          cd santa-api && npm run lint
          cd ../santa-notifications && npm run lint
          cd ../santa-app && npm run lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - name: Install dependencies
        run: |
          cd santa-api && npm ci
          cd ../santa-notifications && npm ci
          cd ../santa-app && npm ci
      - name: Type check
        run: |
          cd santa-api && npx tsc --noEmit
          cd ../santa-notifications && npx tsc --noEmit
          cd ../santa-app && npx tsc --noEmit

  test:
    name: Test (${{ matrix.app }})
    runs-on: ubuntu-latest
    needs: [lint, type-check]
    strategy:
      matrix:
        app: [santa-api, santa-notifications, santa-app]
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379
      rabbitmq:
        image: rabbitmq:3
        ports:
          - 5672:5672
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - name: Install dependencies
        run: cd ${{ matrix.app }} && npm ci
      - name: Run tests
        run: cd ${{ matrix.app }} && npm test -- --run
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/${{ matrix.app }}-test
          REDIS_URL: redis://localhost:6379
          RABBITMQ_URL: amqp://localhost:5672
          JWT_SECRET: ci-test-secret
          SERVICE_API_KEY: ci-service-key

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - name: Build all apps
        run: |
          cd santa-api && npm ci && npm run build
          cd ../santa-notifications && npm ci && npm run build
          cd ../santa-app && npm ci && npm run build
```

### Step 4: Set Up Managed Services

Create free-tier accounts and get connection strings for:

1. **MongoDB Atlas**: Create an M0 cluster. Whitelist `0.0.0.0/0` (allow from anywhere) for simplicity. Create a database user. Copy the connection string.

2. **Redis Cloud**: Create a free database. Copy the public endpoint and password.

3. **CloudAMQP**: Create a Little Lemur instance. Copy the AMQP URL.

Save the connection strings -- you will need them for Step 6.

### Step 5: Deploy Backend Services

Deploy santa-api and santa-notifications to Railway (or Render):

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy santa-api
cd santa-api
railway init
railway up

# Deploy santa-notifications
cd ../santa-notifications
railway init
railway up
```

Or use the Railway web dashboard:
1. Connect your GitHub repo
2. Select the subdirectory for each service
3. Railway will auto-detect Node.js and build

### Step 6: Deploy Frontend

Deploy santa-app to Vercel:

```bash
npm install -g vercel
cd santa-app
vercel
```

Or connect your GitHub repo in the Vercel dashboard:
1. Import project
2. Set root directory to `santa-app`
3. Framework preset: Vite
4. Add environment variables: `VITE_API_URL` and `VITE_NOTIFICATIONS_URL`

### Step 7: Configure Production Environment Variables

Set environment variables on each platform:

**santa-api (Railway):**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
RABBITMQ_URL=amqps://...
JWT_SECRET=<generate with: openssl rand -base64 32>
SERVICE_API_KEY=<generate with: openssl rand -base64 32>
CORS_ORIGIN=https://your-santa-app.vercel.app
```

**santa-notifications (Railway):**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
RABBITMQ_URL=amqps://...
JWT_SECRET=<same as santa-api>
SERVICE_API_KEY=<same as santa-api>
SANTA_API_URL=https://santa-api-production.railway.app
CORS_ORIGIN=https://your-santa-app.vercel.app
```

**santa-app (Vercel):**
```
VITE_API_URL=https://santa-api-production.railway.app
VITE_NOTIFICATIONS_URL=https://santa-notifications-production.railway.app
```

### Step 8: Verify the Deployed Application

Test the full end-to-end flow on production:

1. Open your Vercel URL in the browser
2. Register a new account
3. Create a room
4. Share the invite code with a friend (or use an incognito window)
5. Join the room with the second account
6. Run the draw
7. Send an anonymous message
8. Verify notifications and real-time updates work

## Verification

Test Husky hooks locally:

```bash
# Test commitlint
git commit -m "bad message"
# Expected: rejected by commitlint

git commit -m "feat: add ci/cd configuration"
# Expected: passes commitlint, runs lint-staged

# Test pre-push
git push
# Expected: type-check and tests run before push
```

Test GitHub Actions:

```bash
# Push to a branch and open a PR
git checkout -b feat/ci-cd
git push -u origin feat/ci-cd
# Open a PR on GitHub -- CI workflow should trigger
# Check the Actions tab: lint, type-check, and test jobs should run
```

Test deployed services:

```bash
# Health checks
curl https://santa-api-production.railway.app/health
# Expected: { "status": "ok", ... }

curl https://santa-notifications-production.railway.app/health
# Expected: { "status": "ok", "services": { "mongodb": "connected", "redis": "connected" } }

# Test auth flow
curl -X POST https://santa-api-production.railway.app/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"prod-test@example.com","password":"password123","displayName":"Prod Test"}'
# Expected: { "accessToken": "..." }
```

Open the deployed frontend and complete the full Secret Santa flow: register, create room, invite friends, draw names, send anonymous messages, receive real-time notifications.

## Learn More

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [The Twelve-Factor App](https://12factor.net/)
