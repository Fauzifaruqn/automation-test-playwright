import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { AppSelectors } from '../selectors/app.selectors';
import { UserCredentials } from '../types/order.types';

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async register(credentials: UserCredentials) {
        await this.page.fill(AppSelectors.register.usernameInput, credentials.username);
        await this.page.fill(AppSelectors.register.passwordInput, credentials.password);
        await this.page.click(AppSelectors.register.registerButton);
    }

    async expectRegisterPage() {
        await expect(this.page.locator(AppSelectors.register.heading)).toBeVisible();
        await expect(this.page.locator(AppSelectors.register.usernameInput)).toBeVisible();
        await expect(this.page.locator(AppSelectors.register.passwordInput)).toBeVisible();
    }

    async goToLogin() {
        await this.page.click(AppSelectors.register.loginLink);
    }
}