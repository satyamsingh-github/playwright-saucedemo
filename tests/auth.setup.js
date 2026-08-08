const { test: setup, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { ProductsPage } = require("../pages/ProductsPage");
const testData = require("../data/testData.json");
require("dotenv").config();

// File where the authenticated browser session (cookies/local storage) is saved.
const authFile = "auth/standardUser.json";

/**
 * This "setup" project runs once before the other test projects (see playwright.config.js).
 * It logs in as the standard user a single time and persists the session (storageState)
 * to disk, so regular test files don't need to repeat the login flow — they just
 * load this saved session and land straight on the products page.
 */
setup("authenticate as standard user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  await loginPage.open(testData.urls.base);
  await loginPage.login(
    process.env.STANDARD_USERNAME,
    process.env.STANDARD_PASSWORD
  );

  // Confirm login succeeded before saving the session.
  await expect(page).toHaveURL(testData.urls.inventory);
  await expect(productsPage.pageTitle).toHaveText(testData.expectedMessages.pageTitle);

  await page.context().storageState({ path: authFile });
});
