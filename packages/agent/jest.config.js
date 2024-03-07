/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  rootDir: './src',
  testMatch: ['**/**/__tests__/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: '0.0.1'
  }
}
