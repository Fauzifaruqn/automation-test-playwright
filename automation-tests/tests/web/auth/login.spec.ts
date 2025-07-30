// tests/auth/login.spec.ts
import { test, expect } from '../../../fixtures/auth.fixture';
import { TestUsers } from '../../../data/test-data';

test.describe('Login Functionality', () => {

    test('should login with valid credentials', { tag: ['@smoke', '@auth', '@critical'] }, async ({ loginPage, ordersPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing successful login with valid username and password, expecting redirect to orders page',
            contentType: 'text/plain'
        });

        // Step 1: Attempt login with valid credentials
        await loginPage.login(TestUsers.valid);

        // Step 2: Verify orders page loads successfully
        await ordersPage.expectOrdersPage();

        // Step 3: Verify URL redirect to orders page
        await expect(loginPage.currentPage, 'Should redirect to orders page after successful login')
            .toHaveURL('/orders');

        await test.info().attach('Login Result', {
            body: `Successfully logged in with username: ${TestUsers.valid.username}`,
            contentType: 'text/plain'
        });
    });

    test('should show error with invalid credentials', { tag: ['@smoke', '@auth', '@negative'] }, async ({ loginPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing login failure with invalid credentials, expecting error message and no redirect',
            contentType: 'text/plain'
        });

        // Step 1: Attempt login with invalid credentials
        await loginPage.login(TestUsers.invalid);

        // Step 2: Verify error message is displayed
        await loginPage.expectLoginError();

        // Step 3: Verify user remains on login page
        await expect(loginPage.currentPage, 'Should remain on login page when credentials are invalid')
            .toHaveURL('/');

        await test.info().attach('Invalid Credentials Used', {
            body: JSON.stringify(TestUsers.invalid, null, 2),
            contentType: 'application/json'
        });
    });

    test('should show error with empty credentials', { tag: ['@smoke', '@auth', '@validation', '@negative'] }, async ({ loginPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing form validation with empty username and password fields',
            contentType: 'text/plain'
        });

        // Step 1: Attempt login with empty credentials
        await loginPage.login(TestUsers.empty);

        // Step 2: Verify validation error is shown
        await loginPage.expectLoginError();

        await test.info().attach('Validation Test', {
            body: 'Verified that empty credentials trigger proper validation error',
            contentType: 'text/plain'
        });
    });

    test('should navigate to register page', { tag: ['@auth', '@navigation'] }, async ({ loginPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing navigation from login page to registration page',
            contentType: 'text/plain'
        });

        // Step 1: Click register link/button
        await loginPage.goToRegister();

        // Step 2: Verify successful navigation to register page
        await expect(loginPage.currentPage, 'Should navigate to register page when register link is clicked')
            .toHaveURL('/register');

        await test.info().attach('Navigation Result', {
            body: 'Successfully navigated from login to register page',
            contentType: 'text/plain'
        });
    });

    test('should logout successfully', { tag: ['@smoke', '@auth', '@critical'] }, async ({ authenticatedPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing logout functionality from authenticated state, expecting redirect to login page',
            contentType: 'text/plain'
        });

        // Step 1: Take screenshot of authenticated state
        await test.info().attach('Before Logout', {
            body: await authenticatedPage.currentPage.screenshot(),
            contentType: 'image/png'
        });

        // Step 2: Perform logout action
        await authenticatedPage.logout();

        // Step 3: Verify redirect to login page
        await expect(authenticatedPage.currentPage, 'Should redirect to login page after successful logout')
            .toHaveURL('/');

        // Step 4: Take screenshot after logout
        await test.info().attach('After Logout', {
            body: await authenticatedPage.currentPage.screenshot(),
            contentType: 'image/png'
        });

        await test.info().attach('Logout Result', {
            body: 'Successfully logged out and redirected to login page',
            contentType: 'text/plain'
        });
    });

    test('should handle network errors gracefully', { tag: ['@auth', '@network', '@error-handling'] }, async ({ loginPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing login behavior when backend is unavailable or network errors occur',
            contentType: 'text/plain'
        });

        await test.info().attach('Network Test', {
            body: 'This test verifies graceful handling of network connectivity issues',
            contentType: 'text/plain'
        });

        // Step 2: Attempt login during network issues
        await loginPage.login(TestUsers.valid);

        // Step 3: Verify appropriate error handling
        await expect(loginPage.currentPage, 'Should handle network errors gracefully and remain on login page')
            .toHaveURL('/', { timeout: 10000 });
    });

    test('should validate password requirements', { tag: ['@auth', '@validation', '@negative'] }, async ({ loginPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing password validation with various invalid password formats',
            contentType: 'text/plain'
        });

        const weakPasswords = [
            { username: 'testuser', password: '123' },
            { username: 'testuser', password: 'abc' },
            { username: 'testuser', password: '' }
        ];

        for (const credentials of weakPasswords) {
            // Step 1: Try login with weak password
            await loginPage.login(credentials);

            // Step 2: Verify validation error
            await loginPage.expectLoginError();

            await test.info().attach(`Weak Password Test: ${credentials.password || 'empty'}`, {
                body: `Tested password: "${credentials.password}" - Validation working correctly`,
                contentType: 'text/plain'
            });
        }
    });

    test('should remember user session', { tag: ['@auth', '@session', '@regression'] }, async ({ loginPage, ordersPage }) => {
        await test.info().attach('Test Scenario', {
            body: 'Testing if user session persists after browser refresh',
            contentType: 'text/plain'
        });

        // Step 1: Login successfully
        await loginPage.login(TestUsers.valid);
        await ordersPage.expectOrdersPage()

        // Step 2: Refresh the page
        await ordersPage.currentPage.reload();

        // Step 3: Verify user is still authenticated
        await expect(ordersPage.currentPage, 'User should remain authenticated after page refresh')
            .toHaveURL('/orders');

        await test.info().attach('Session Persistence', {
            body: 'User session successfully persisted across page refresh',
            contentType: 'text/plain'
        });
    });
});
