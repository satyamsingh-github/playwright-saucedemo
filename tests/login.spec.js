const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { ProductsPage } = require("../pages/ProductsPage");
const testData = require("../data/testData.json");
require("dotenv").config();

// This spec runs with a fresh, unauthenticated browser context (see playwright.config.js
// "chromium-no-auth" project) since it needs to exercise the login form itself.
test.describe("Login", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open(testData.urls.base);
  });

  test("standard user can log in successfully", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await loginPage.login(
      process.env.STANDARD_USERNAME,
      process.env.STANDARD_PASSWORD
    );

    await expect(page).toHaveURL(testData.urls.inventory);
    const title = await productsPage.isLoaded();
    expect(title).toBe(testData.expectedMessages.pageTitle);
  });

  test("locked out user sees locked out error", async () => {
    await loginPage.login(
      process.env.LOCKED_USERNAME,
      process.env.LOCKED_PASSWORD
    );

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(testData.expectedMessages.lockedOut);
  });

  test("invalid credentials show an error and do not navigate away", async ({ page }) => {
    await loginPage.login("invalid_user", "wrong_password");

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(testData.expectedMessages.invalidCredentials);
    await expect(page).toHaveURL(testData.urls.base);
  });

  test("empty credentials show a required-field error", async () => {
    await loginPage.login("", "");

    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username is required");
  });
});
