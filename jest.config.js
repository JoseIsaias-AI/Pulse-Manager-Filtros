module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.integration.test.ts'],
  setupFiles: ['<rootDir>/src/tests/setup-env.ts'],
  clearMocks: true,
  verbose: true
};
