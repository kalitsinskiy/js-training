module.exports = {
  // Root directory for Jest
  rootDir: '..',

  // Test match patterns - look for test files in __tests__ directories
  testMatch: [
    '<rootDir>/modules/**/__tests__/**/*.test.{js,ts,jsx,tsx}',
  ],

  // Transform files with babel-jest and ts-jest
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './config/.babelrc' }],
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Setup files after environment
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],

  // Test environment - default to node, but can be overridden per test file
  testEnvironment: 'node',

  // Test environment options for jsdom (React tests)
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },

  // Projects for different test environments
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/modules/01-javascript-basics/**/__tests__/**/*.test.{js,ts}',
        '<rootDir>/modules/02-typescript-basics/**/__tests__/**/*.test.{js,ts}',
        '<rootDir>/modules/03-nodejs-backend/**/__tests__/**/*.test.{js,ts}',
      ],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './config/.babelrc' }],
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: './config/tsconfig.json',
        }],
      },
    },
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/modules/04-react-frontend/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
      ],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './config/.babelrc' }],
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            jsx: 'react',
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          },
        }],
      },
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
    },
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'modules/**/exercises/**/*.{js,ts,jsx,tsx}',
    '!modules/**/examples/**',
    '!modules/**/__tests__/**',
    '!**/node_modules/**',
  ],

  coverageDirectory: '<rootDir>/coverage',

  coverageReporters: ['text', 'lcov', 'html'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
  ],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Clear mocks automatically between every test
  clearMocks: true,

  // Verbose output
  verbose: true,
};
