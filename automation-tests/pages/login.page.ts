import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { AppSelectors } from '../selectors/app.selectors';
import { UserCredentials } from '../types/order.types';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async login(credentials: UserCredentials) {
        await this.page.fill(AppSelectors.login.usernameInput, credentials.username);
        await this.page.fill(AppSelectors.login.passwordInput, credentials.password);
        await this.page.click(AppSelectors.login.loginButton);
    }

    async expectLoginPage() {
        await expect(this.page.locator(AppSelectors.login.heading), 'Login heading should be visible').toBeVisible();
        await expect(this.page.locator(AppSelectors.login.usernameInput), 'Username input should be visible').toBeVisible();
        await expect(this.page.locator(AppSelectors.login.passwordInput), 'Password input should be visible').toBeVisible();
    }

    async goToRegister() {
        await this.page.click(AppSelectors.navigation.registerLink);
    }

    async expectLoginError() {
        await expect(this.page, 'Should remain on login page after failed login').toHaveURL('/');
        await this.expectLoginPage();
        await expect(this.page.getByText('Invalid credentials'), 'Error message should be visible : "Invalid credentials"').toBeVisible();
    }
}