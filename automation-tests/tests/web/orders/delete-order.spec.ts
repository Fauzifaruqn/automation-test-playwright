import { test, expect } from '../../../fixtures/auth.fixture';
import { TestOrders } from '../../../data/test-data';

test.describe('Delete Order Functionality', () => {

    test.beforeEach(async ({ authenticatedPage, page }) => {
        await authenticatedPage.clearAllOrders();
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

        await authenticatedPage.createOrder(firstOrder);
        await authenticatedPage.expectOrderInList({ item: firstOrder.item });

        await page.waitForTimeout(2000); // Ensure the first order is processed
        await authenticatedPage.createOrder(secondOrder);
        await authenticatedPage.expectOrderInList({ item: secondOrder.item });

        const count = await authenticatedPage.getOrdersCount();
        console.log(`Order count after setup: ${count}`);
        expect(count, 'Should start each test with exactly 2 orders').toBe(2);
    });

    test('should delete order with confirmation', { tag: ['@smoke', '@critical', '@delete-order'] }, async ({ authenticatedPage }) => {
        const initialCount = await authenticatedPage.getOrdersCount();
        console.log(`Initial count: ${initialCount}`);

        // Perform deletion
        await authenticatedPage.deleteOrder(0, true);

        // Wait for success message to appear and disappear
        await expect(authenticatedPage.currentPage.locator('text=Order deleted successfully!')).toBeVisible();
        await expect(authenticatedPage.currentPage.locator('text=Order deleted successfully!')).not.toBeVisible({ timeout: 10000 });

        // Wait for DOM to update with polling
        await expect.poll(async () => {
            const count = await authenticatedPage.getOrdersCount();
            console.log(`Current count: ${count}`);
            return count;
        }, {
            message: 'Order count should decrease after deletion',
            timeout: 15000,
            intervals: [500, 1000, 2000]
        }).toBe(initialCount - 1);

        const newCount = await authenticatedPage.getOrdersCount();
        expect(newCount, 'Order count should decrease by 1 after deletion').toBe(initialCount - 1);
    });

    test('should cancel delete operation', { tag: ['@regression', '@delete-order'] }, async ({ authenticatedPage }) => {
        const initialCount = await authenticatedPage.getOrdersCount();

        await authenticatedPage.deleteOrder(0, false);

        const newCount = await authenticatedPage.getOrdersCount();
        expect(newCount, 'Order count should remain same after canceling delete').toBe(initialCount);
    });

    test('should show confirmation dialog', { tag: ['@ui', '@regression', '@delete-order'] }, async ({ authenticatedPage }) => {
        const deleteButtons = authenticatedPage.currentPage.locator('button:has-text("Delete")');
        await deleteButtons.first().click();

        await expect(authenticatedPage.currentPage.locator('text=Are you sure you want to delete this order?')).toBeVisible();
        await expect(authenticatedPage.currentPage.locator('button:has-text("Yes, Delete")')).toBeVisible();
        await expect(authenticatedPage.currentPage.locator('button:has-text("Cancel")')).toBeVisible();

        await authenticatedPage.currentPage.click('button:has-text("Cancel")');
    });
});