
const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Environmwent-specific base URLs with fallback to defaults
const PROD_BASE_URL    = process.env.PROD_BASE_URL    || 'https://pocketaces2.github.io/fashionhub/';
const STAGING_BASE_URL = process.env.STAGING_BASE_URL || 'https://staging-env/fashionhub/';
const LOCAL_BASE_URL   = process.env.LOCAL_BASE_URL   || 'http://localhost:4000/fashionhub/';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'on-failure' }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || PROD_BASE_URL || 'https://pocketaces2.github.io/fashionhub/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'prod-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'prod-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'prod-webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'staging-chromium',
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: STAGING_BASE_URL || 'https://staging-env/fashionhub/' 
      },
    },
    {
      name: 'local-chromium',
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: LOCAL_BASE_URL || 'http://localhost:4000/fashionhub/' 
      },
    },
  ],
});
