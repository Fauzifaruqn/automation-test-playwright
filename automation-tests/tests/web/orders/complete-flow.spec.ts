import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { OrdersPage } from '../../../pages/orders.page';
import { TestUsers, TestOrders } from '../../../data/test-data';

test.describe('Complete User Flow', () => {
    test('should complete full order management flow', {
        tag: ['@e2e', '@critical', '@smoke', '@orders', '@full-flow']
    }, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const ordersPage = new OrdersPage(page);

        await loginPage.navigate('/');
        await loginPage.login(TestUsers.valid);
        await ordersPage.expectOrdersPage();

        const initialCount = await ordersPage.getOrdersCount();
        await ordersPage.createOrder(TestOrders.valid);
        await ordersPage.expectOrderInList({ item: TestOrders.valid.item });

        console.log('Starting edit process...');
        await ordersPage.editOrder(0);

        await expect(page.locator('h2:has-text("Edit Order")')).toBeVisible();

        const updatedOrder = {
            ...TestOrders.valid,
            item: 'Updated Item',
            notes: 'Updated during E2E test',
        };

        console.log('Updating order with:', updatedOrder);
        await ordersPage.updateOrder(updatedOrder);
        await ordersPage.expectOrderInList({ item: updatedOrder.item });

        await ordersPage.deleteOrder(0, true);
        await ordersPage.expectOrderInList({ item: updatedOrder.item }, false);

        await ordersPage.logout();
        await expect(page).toHaveURL('/');
    });

    test('should handle multiple orders correctly', {
        tag: ['@e2e', '@orders', '@regression', '@multiple-orders']
    }, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const ordersPage = new OrdersPage(page);

        await loginPage.navigate('/');
        await loginPage.login(TestUsers.valid);

        const firstOrder = {
            ...TestOrders.valid,
            item: `Pizza-${Date.now()}-1`
        };

        const secondOrder = {
            ...TestOrders.minimal,
            item: `Burger-${Date.now()}-2`
        };

        console.log('First order:', firstOrder);
        console.log('Second order:', secondOrder);

        await ordersPage.createOrder(firstOrder);
        await ordersPage.expectOrderInList({ item: firstOrder.item });

        await page.waitForTimeout(2000);
        await ordersPage.createOrder(secondOrder);
        await ordersPage.expectOrderInList({ item: secondOrder.item });

        const finalCount = await ordersPage.getOrdersCount();
        expect(finalCount).toBeGreaterThanOrEqual(2);
    });
});