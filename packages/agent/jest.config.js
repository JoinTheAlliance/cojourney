export default {
  transform: {},
  testEnvironment: 'node',
  rootDir: '__tests__',
  testMatch: [
    "**/*.test.js"
  ],
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: "0.0.1",
  }
}
