const { test, expect } = require('@playwright/test');
require('dotenv').config();

const HomePage = require('../pages/HomePage');

test.describe('FashionHub Logout', () => {
  // Valid logout test pass when checking for Login page 
  test('Valid logout leads to login page', async ({ page }) => {
    const homePage = new HomePage(page);

    // Step 1: Navigate to the home page, validates that the URL contains "account"
    await test.step('Navigate to home page', async () => {
      await homePage.goto();
      await expect(page).toHaveURL(/account/i);
    });

    // Step 2: Perform logout action by clicking the logout button
    await test.step('Logout from home page', async () => {
      await homePage.logout();
    });

    // Step 3: Verify that the welcome message is displayed with the correct username
    await test.step('Verify back to login page', async () => {
      await homePage.verifyLoginPage();
    });
  });
});