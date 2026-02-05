/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "server.js",
    "backend/**/*.js",
    "!backend/index.js",
    "!**/node_modules/**",
    "!**/coverage/**"
  ],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
