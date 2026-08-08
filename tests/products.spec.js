const { test, expect } = require("@playwright/test");
const { ProductsPage } = require("../pages/ProductsPage");
const testData = require("../data/testData.json");

// This spec runs under the "chromium" project, which is configured in playwright.config.js
// to load auth/standardUser.json as storageState. That means each test here starts
// already logged in — no login step needed.
test.describe("Products page", () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await page.goto(testData.urls.inventory);
  });

  test("loads with the correct title and product count", async () => {
    const title = await productsPage.isLoaded();
    expect(title).toBe(testData.expectedMessages.pageTitle);

    const count = await productsPage.getProductCount();
    expect(count).toBe(testData.products.length);
  });

  test("lists the expected product names", async () => {
    const names = await productsPage.getAllProductNames();
    const expectedNames = testData.products.map((p) => p.name);
    expect(names.sort()).toEqual(expectedNames.sort());
  });

  test("can sort products by price low to high", async () => {
    await productsPage.sortBy(testData.sortOptions.lohi);

    const prices = await productsPage.getAllProductPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace("$", "")));
    const sorted = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sorted);
  });

  test("can sort products by name Z to A", async () => {
    await productsPage.sortBy(testData.sortOptions.za);

    const names = await productsPage.getAllProductNames();
    const sorted = [...names].sort().reverse();

    expect(names).toEqual(sorted);
  });

  test("adding a product updates the cart badge count", async () => {
    const productName = testData.products[0].name;

    await productsPage.addProductToCart(productName);
    const cartCount = await productsPage.getCartCount();

    expect(cartCount).toBe("1");
  });

  test("logout returns to the login page", async ({ page }) => {
    await productsPage.logout();
    await expect(page).toHaveURL(testData.urls.base);
  });
});
