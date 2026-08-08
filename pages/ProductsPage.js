const { BasePage } = require("./BasePage");

class ProductsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Locators
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.itemName = page.locator(".inventory_item_name");
    this.itemPrice = page.locator(".inventory_item_price");
    this.sortDropdown = page.locator(".product_sort_container");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");

    this.addToCartButton = (itemName) =>
      page.locator(".inventory_item", { hasText: itemName }).locator("button", { hasText: "Add to cart" });
  }

  async isLoaded() {
    await this.waitForVisible(this.pageTitle);
    return this.getText(this.pageTitle);
  }

  async getProductCount() {
    return this.inventoryItems.count();
  }

  async getAllProductNames() {
    return this.itemName.allTextContents();
  }

  async getAllProductPrices() {
    return this.itemPrice.allTextContents();
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async addProductToCart(itemName) {
    await this.addToCartButton(itemName).click();
  }

  async getCartCount() {
    if (await this.cartBadge.isVisible()) {
      return this.getText(this.cartBadge);
    }
    return "0";
  }

  async logout() {
    await this.click(this.burgerMenuButton);
    await this.click(this.logoutLink);
  }
}

module.exports = { ProductsPage };
