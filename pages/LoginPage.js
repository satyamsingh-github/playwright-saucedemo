const { BasePage } = require("./BasePage");

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Locators
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator(".error-button");
  }

  async open(baseUrl) {
    await this.goto(baseUrl);
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  async isLoginButtonVisible() {
    return this.isVisible(this.loginButton);
  }
}

module.exports = { LoginPage };
