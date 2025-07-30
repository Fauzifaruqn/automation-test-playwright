import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { TestUsers } from '../../../data/test-data';

test.describe('Login Visual Testing', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        // Set consistent viewport and device scale factor
        await page.setViewportSize({ width: 1920, height: 1080 });

        loginPage = new LoginPage(page);
        await loginPage.navigate('/');
    });

    test('should match login page visual design', async ({ page }) => {
        await test.info().attach('Test Scenario', {
            body: 'Visual regression testing for login page layout and styling',
            contentType: 'text/plain'
        });

        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('login-page-full.png', {
            fullPage: true,
            animations: 'disabled',
            threshold: 0.3, // Allow 30% pixel difference
            maxDiffPixels: 1000 // Allow up to 1000 different pixels
        });
    });

    test('should match login form visual design', async ({ page }) => {
        const loginForm = page.locator('form, .login-form, .login-container').first();
        await expect(loginForm).toHaveScreenshot('login-form.png', {
            animations: 'disabled',
            threshold: 0.3,
            maxDiffPixels: 500
        });
    });

    test('should show error state visually', async ({ page }) => {
        await loginPage.login(TestUsers.invalid);
        await page.waitForSelector('text="Invalid credentials"');

        await expect(page).toHaveScreenshot('login-error-state.png', {
            fullPage: true,
            animations: 'disabled',
            threshold: 0.3,
            maxDiffPixels: 1000
        });
    });

    test('should match empty validation errors visually', async ({ page }) => {
        await loginPage.login(TestUsers.empty);
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot('login-validation-errors.png', {
            fullPage: true,
            animations: 'disabled',
            threshold: 0.3,
            maxDiffPixels: 1000
        });
    });

    test('should match logo visual design', async ({ page }) => {
        await test.info().attach('Test Scenario', {
            body: 'Visual regression testing for logo display and styling',
            contentType: 'text/plain'
        });

        const logo = page.locator('img[alt="Logo"][src*="/static/media/logoorder"]');
        await expect(logo).toBeVisible();

        await expect(logo).toHaveScreenshot('login-logo.png', {
            animations: 'disabled',
            threshold: 0.2,
            maxDiffPixels: 100
        });
    });
});
