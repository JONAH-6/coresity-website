/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'

// Motion tests for the homepage. Run with `yarn test:e2e`.
// Reuses a running `yarn rw dev` locally; CI always starts its own.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8910',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'yarn rw dev web --fwd="--open=false"',
    url: 'http://localhost:8910',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
