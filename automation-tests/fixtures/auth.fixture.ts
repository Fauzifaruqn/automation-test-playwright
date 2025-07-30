import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { OrdersPage } from '../pages/orders.page';
import { UserCredentials } from '../types/order.types';

type AuthFixtures = {
    loginPage: LoginPage;
    ordersPage: OrdersPage;
    authenticatedPage: OrdersPage;
};

export const test = base.extend<AuthFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate('/');
        await use(loginPage);
    },

    ordersPage: async ({ page }, use) => {
        const ordersPage = new OrdersPage(page);
        await use(ordersPage);
    },

    authenticatedPage: async ({ page }, use) => {
        // Auto-login fixture
        const loginPage = new LoginPage(page);
        const ordersPage = new OrdersPage(page);

        await loginPage.navigate('/');
        await loginPage.login({ username: 'fauzi', password: 'test1234' });
        await ordersPage.expectOrdersPage();

        await use(ordersPage);
    },
});

export { expect } from '@playwright/test';