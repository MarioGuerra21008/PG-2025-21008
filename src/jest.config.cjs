/** @type {import('jest').Config} */
module.exports = {
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "reports", outputName: "junit-jest.xml" }],
  ],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/**/index.ts",
    "!src/**/index.tsx",
    "!src/**/__tests__/**",
    "!src/**/*.d.ts",
    "!src/**/stories/**",
  ],
  coverageReporters: ["text", "lcov", "json-summary"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2020",
          parser: { syntax: "typescript", tsx: true, decorators: true },
          transform: { react: { runtime: "automatic" } },
        },
      },
    ],
  },
  moduleNameMapper: {
    // Mock de assets
    "^@/assets/.*\\.(png|jpe?g|gif|svg|webp|avif)(\\?url)?$":
      "<rootDir>/test/__mocks__/fileMock.cjs",
    "\\.(png|jpe?g|gif|svg|webp|avif)(\\?url)?$":
      "<rootDir>/test/__mocks__/fileMock.cjs",

    // Estilos
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // Alias
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironmentOptions: { url: "http://localhost/" },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/mocha_tests/",
    "/cypress/",
    "/selenium_tests/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-pdf|pdfjs-dist)/)",
  ],
};