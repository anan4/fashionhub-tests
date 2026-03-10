const { expect } = require('@playwright/test');
require('dotenv').config();

const LoginPage = require('../pages/LoginPage');
const messages = require('../testdata/messages');

// Page Object Model for the Home Page
class HomePage {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    // Define locators for the home page web elements
    this.logoutButton = page.locator('text=Logout');
    this.loginPageTitle = page.locator('text=Login to FashionHub');
  }

  // Method to navigate to the home page
  async goto() {
    await this.page.goto('login.html');
    await this.loginPage.validLogin();
    await this.page.goto('account.html');
  }

  // Method click the logout button to perform logout action
  async logout() {
    await this.logoutButton.click();
  }

  // Method verify that the login page is displayed after logout action
  async verifyLoginPage() {
    await expect(this.loginPageTitle).toBeVisible();
    await expect(this.loginPageTitle).toHaveText(messages.login.pageTitle);
  }
}

module.exports = HomePage; 