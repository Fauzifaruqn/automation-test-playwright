import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    // Add public getter for page
    get currentPage(): Page {
        return this.page;
    }

    async navigate(path: string = '') {
        await this.page.goto(path);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }

    // Add URL verification method
    async expectURL(expectedURL: string) {
        await expect(this.page).toHaveURL(expectedURL);
    }
}