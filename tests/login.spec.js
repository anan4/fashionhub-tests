const { test, expect } = require('@playwright/test');
require('dotenv').config();

const LoginPage = require('../pages/LoginPage');
const users = require('../testdata/users.json');

const validUsername = users.valid.username || 'demouser';
const validPassword = users.valid.password || 'demo123';
const invalidUsername = users.invalid.username || 'invalid_user';
const invalidPassword = users.invalid.password || 'wrong_password';

test.describe('FashionHub Login', () => {
  // Valid login test pass when checking for Welcome page 
  test('Valid login shows welcome message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to the login page, validates that the URL contains "login"
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/login/i);
    });

    // Step 2: Perform login with valid credentials using values in .env file
    await test.step('Login with valid credentials', async () => {
      await loginPage.login(validUsername, validPassword);
    });

    // Step 3: Verify that the welcome message is displayed with the correct username
    await test.step('Verify welcome message with username', async () => {
      await loginPage.verifyWelcome(validUsername);
    });
  });

  // Invalid login with invalid credentials test pass when checking for error message
  test('Validate error message when using invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(invalidUsername, invalidPassword);
    await loginPage.verifyErrorMessage();
    await loginPage.verifyErrorMessageText();
  });

  // Empty credentials test pass when checking for HTML validation error (element invalid)
  test('Empty credentials show validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.verifyValidationError();
  });
});