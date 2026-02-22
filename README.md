# Fashionhub Demo App – E2E Tests (Playwright)

## Overview

This repository contains end-to-end tests for the **Fashionhub Demo App** using **Playwright Test**.  
The goal is to provide a small but production-like UI test suite with a clear structure, multiple environments, and externalised configuration.

---

## 1. Prerequisites

- Node.js 18+  
- npm  
- Docker Desktop installed and running (for the local container)

## 2. Install dependencies

From the project root:

npm install
npx playwright install

This installs all npm dependencies and the Playwright browsers.

## 3. Run the Fashionhub Demo App locally (Docker)

The application under test is provided as a Docker image:

docker pull pocketaces2/fashionhub-demo-app
docker run -p 4000:4000 pocketaces2/fashionhub-demo-app:latest

Once the container is running, the application is available at:
http://localhost:4000/fashionhub/

## 4. Environment configuration

Environment-specific base URLs are controlled via environment variables with the following precedence:

1. Value passed from the command line / CI (e.g. via cross-env or system env vars).
2. Value from a .env file (loaded by dotenv).
3. Default value defined inside playwright.config.js.

Example .env file (optional, for local development):

  PROD_BASE_URL=https://pocketaces2.github.io/fashionhub/

  STAGING_BASE_URL=https://staging-env/fashionhub/

  LOCAL_BASE_URL=http://localhost:4000/fashionhub/

The playwright.config.js uses these variables to configure the baseURL for each Playwright project (prod-*, staging-*, local-*).

## 5. How to run the tests

All the tests are expected to pass according to the expected results.

### 5.1. Run tests against production

npm run test:prod

This runs the tests against the public Fashionhub instance (https://pocketaces2.github.io/fashionhub/).

### 5.2. Run tests against local Docker container

Start the Docker container (see section 3).

In a new terminal, run:

npm run test:local

This executes the tests using the local-chromium Playwright project, pointing to http://localhost:4000/fashionhub/.

#### Note about local Docker vs public instance
When running against the **public** Fashionhub instance (https://pocketaces2.github.io/fashionhub/), a successful login returns:

"Welcome, demouser"

However, when running against the Dockerized local instance (pocketaces2/fashionhub-demo-app), the same valid login returns:

"Welcome, testUser"

This difference in UI text causes the “valid login” assertion to fail in local as the expected value seems to be hard-coded for the local environment only.
In the tests, this behaviour is intentionally left visible to highlight that the suite is actually executed against the local Docker container and that UI expectations may differ between environments.


### 5.3. Run tests against staging

npm run test:staging

This will fail if staging environment is not available.

### 5.4. Example of CLI overriding config

The following script (example) runs the staging project but forces its baseURL to use the production URL to demonstrate CLI precedence over .env and default config:

npm run test:staging-as-prod

See package.json for the exact command definition.

## 6. Project structure

fashionhub-tests/
  playwright.config.js      # Playwright configuration (projects, reporters, base URLs)

  package.json              # npm scripts and dependencies

  .env                      # (optional) environment variables for local development

  tests/

    login.spec.js           # Login-related test cases

  pages/

    LoginPage.js            # Page Object for the login page

  testdata/

    messages.json           # UI messages (welcome text, error messages, etc.)

    users.json              # Test users (valid / invalid credentials)

The tests use the Page Object pattern to keep selectors and page-specific logic in one place, and external JSON files to avoid hard-coded UI strings and credentials in the code. This makes the suite easier to maintain and extend.

## 7. Build and run summary

1. Install dependencies and Playwright browsers:

  npm install
  
  npx playwright install

2. Run the application (Docker):

  docker pull pocketaces2/fashionhub-demo-app

  docker run -p 4000:4000 pocketaces2/fashionhub-demo-app:latest

3. Run tests:

  npm run test:local      # against local Docker container

  npm run test:prod       # against public production URL

  npm run test:staging    # against staging URL

## 8. Multi-browser execution

The Playwright configuration in the package.json file defines multiple **projects**, one per browser and environment:

- `prod-chromium`, `prod-firefox`, `prod-webkit`
- `staging-chromium`
- `local-chromium`

By default, the `test:prod` script runs the production tests in **all three browsers**:

npm run test:prod
 => runs prod-chromium, prod-firefox and prod-webkit

This configuration can be modified as desired. If you want, for exemple, execute the tests on the local environment against Firefox browser, just create "local-firefox" project in the package.json file and then run it.

## 9. Test coverage

The current Playwright project version includes the following e2e tests:

1. Valid login with valid credentials (demouser, fashion123)

2. Invalid login with existing user (demouser) and invalid password

3. Invalid login with empty user / password fields

## 10. Results report
Results report is always stored on file: 'playwright-report/index.html'. This report is only automatically launched when at least one test fails. If you want web report to be always launched automatically at the end of the test execution, change the following parameter in 'playwright.config.js' file:

reporter: [
    ['html', { open: 'on-failure' }],

to:

reporter: [
    ['html', { open: 'always' }],

## 11. Potential future improvements:

- Add more test coverage (filters, cart, checkout flows).
- Integrate with CI (e.g. GitHub Actions) to run npm run test:prod on each push and publish the Playwright HTML report as an artifact.
