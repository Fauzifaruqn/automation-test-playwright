// tests/auth/register.spec.ts
import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/register.page';
import { TestUsers } from '../../../data/test-data';

test.describe('Registration Functionality', () => {
    test('should display register page correctly', { tag: ['@smoke', '@register'] }, async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        await registerPage.expectRegisterPage();
    });

    test('should navigate to login page from register', { tag: ['@ui', '@register'] }, async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        await registerPage.goToLogin();
        await expect(page).toHaveURL('/');
    });

    test('should attempt registration with unique valid data', { tag: ['@regression', '@register'] }, async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        // Generate unique username and password
        const uniqueId = Date.now();
        const username = `user_${uniqueId}`;
        const password = `pass_${uniqueId}`;
        await registerPage.register({
            username,
            password
        });

        // Assert registration success (update selector/text as per your app)
        await expect(page.getByText('Registered successfully. Please login.')).toBeVisible();
    });

    test('should not allow registration with an existing username', { tag: ['@validation', '@register'] }, async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        // Use a known existing user from test data
        const existingUser = TestUsers.valid;
        await registerPage.register({
            username: existingUser.username,
            password: existingUser.password
        });

        // Assert error message for duplicate username
        await expect(page.getByText('Username already exists')).toBeVisible();
    });
});