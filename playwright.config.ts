import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:3000',
  },
  globalSetup: undefined,
});
