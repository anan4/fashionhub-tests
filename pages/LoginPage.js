const { expect } = require('@playwright/test');
require('dotenv').config();

const messages = require('../testdata/messages');

// Page Object Model for the Login Page
class LoginPage {
  constructor(page) {
    this.page = page;
    // Define locators for the login page web elements
    this.usernameInput = page.locator('//*[@id="username"]');
    this.passwordInput = page.locator('//*[@id="password"]');
    this.loginButton = page.locator('//*[@id="loginForm"]/input[3]');
    this.welcomeMessage = page.locator('text=Welcome');
    this.errorMessage = page.getByText('Invalid', { exact: false });
  }

  // Method to navigate to the login page
  async goto() {
    await this.page.goto('login.html');
  }

  // Method to perform login action by inserting username and password and clicking the login button
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Method to verify that the welcome message is displayed with the correct username
  async verifyWelcome(username) {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.welcomeMessage).toHaveText(`${messages.login.welcomeText}, ${username}!`);
  }

  // Method to verify that the error message is displayed
  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  // Method to verify that the error message text is correct
  async verifyErrorMessageText() {
    await expect(this.errorMessage).toHaveText(messages.login.errorText);
  }

  // Method to verify that required field HTML tooltip is shown when username and password fields are empty (element incalid)
  async verifyValidationError() {
      const isValid = await this.usernameInput.evaluate(
    el => el.checkValidity()
    );
    await expect(isValid).toBe(false);
  }
}

module.exports = LoginPage;