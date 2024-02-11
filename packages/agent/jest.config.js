/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '__tests__',
  testMatch: ['**/*.test.ts'],
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: '0.0.1'
  }
}
