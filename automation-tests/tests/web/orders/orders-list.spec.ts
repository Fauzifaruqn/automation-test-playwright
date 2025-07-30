import { test, expect } from '../../../fixtures/auth.fixture';
import { TestOrders } from '../../../data/test-data';
import { AppSelectors } from '../../../selectors/app.selectors';

test.describe('Orders List Display', { tag: '@orders-list' }, () => {

    test.beforeEach(async ({ authenticatedPage }) => {
        await authenticatedPage.clearAllOrders();
    });

    test('should display orders list section', { tag: '@smoke' }, async ({ authenticatedPage, page }) => {
        await expect(page.locator('h3:has-text("Your Orders")')).toBeVisible();
    });

    test('should display order details correctly', { tag: '@regression' }, async ({ authenticatedPage, page }) => {
        const uniqueOrder = {
            ...TestOrders.valid,
            item: `Test-Pizza-${Date.now()}`,
            deliveryAddress: `123 Unique Street ${Date.now()}`,
            phoneNumber: `555${Date.now().toString().slice(-7)}`,
            notes: `Unique test notes ${Date.now()}`
        };

        await authenticatedPage.createOrder(uniqueOrder);

        await authenticatedPage.expectOrderInList({ item: uniqueOrder.item });

        const ordersList = page.locator(AppSelectors.orders.ordersList);
        const orderCard = ordersList.locator('li.order-card').filter({ hasText: uniqueOrder.item });

        await expect(orderCard.locator(`text=${uniqueOrder.deliveryAddress}`)).toBeVisible();
        await expect(orderCard.locator(`text=${uniqueOrder.phoneNumber}`)).toBeVisible();
        await expect(orderCard.locator(`text=${uniqueOrder.notes}`)).toBeVisible();
    });

    test('should show edit and delete buttons for each order', { tag: '@ui' }, async ({ authenticatedPage, page }) => {
        const testOrder = {
            ...TestOrders.valid,
            item: `Test-Item-${Date.now()}`
        };

        await authenticatedPage.createOrder(testOrder);

        const orderCard = page.locator('li.order-card').filter({ hasText: testOrder.item });
        await expect(orderCard.locator('button:has-text("Edit")')).toBeVisible();
        await expect(orderCard.locator('button:has-text("Delete")')).toBeVisible();
    });

    test('should handle empty orders list', { tag: '@edge-case' }, async ({ authenticatedPage, page }) => {
        const ordersCount = await authenticatedPage.getOrdersCount();
        expect(ordersCount, 'Should start with empty orders list').toBe(0);

        const ordersList = authenticatedPage.currentPage.locator(AppSelectors.orders.ordersList);
        await expect(ordersList).toHaveCount(0);
        await expect(page.locator('text=No orders found')).toBeVisible();
    });
});
