import { defineConfig } from 'cypress';
import codeCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1366,
    viewportHeight: 800,
    video: false,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    retries: { runMode: 2, openMode: 0 },
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
      mochaFile: 'reports/junit-cypress-[hash].xml',
      testsuitesTitle: 'Cypress E2E'
    },
    setupNodeEvents(on, config) { 
      codeCoverage(on, config);
      return config;
    },
  },
});