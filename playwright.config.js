const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },

  projects: [
    // 1. Runs first: logs in once and writes auth/standardUser.json (the session).
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
    },

    // 2. Login tests need a clean, unauthenticated browser — no storageState here.
    {
      name: "chromium-no-auth",
      testMatch: /login\.spec\.js/,
      use: { ...devices["Desktop Chrome"] },
    },

    // 3. Everything else reuses the saved session and skips the login step.
    {
      name: "chromium",
      testMatch: /products\.spec\.js/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "auth/standardUser.json",
      },
    },
  ],
});
