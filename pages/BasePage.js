/**
 * BasePage
 * Holds generic, reusable actions that every page object can inherit.
 * Keeps individual page classes focused only on page-specific locators/actions.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async getTitle() {
    return this.page.title();
  }

  async getUrl() {
    return this.page.url();
  }

  async click(locator) {
    await locator.click();
  }

  async fill(locator, text) {
    await locator.fill(text);
  }

  async getText(locator) {
    return (await locator.textContent())?.trim();
  }

  async isVisible(locator) {
    return locator.isVisible();
  }

  async waitForVisible(locator) {
    await locator.waitFor({ state: "visible" });
  }
}

module.exports = { BasePage };
