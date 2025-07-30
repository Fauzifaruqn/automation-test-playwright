import { test, expect } from '../../../fixtures/auth.fixture';
import { TestOrders } from '../../../data/test-data';

test.describe('Update Order Functionality', () => {
    test.beforeEach(async ({ authenticatedPage }) => {
        await authenticatedPage.createOrder(TestOrders.valid);
    });

    test('should edit existing order', { tag: ['@orders', '@update-order', '@edit'] }, async ({ authenticatedPage }) => {
        await authenticatedPage.editOrder(0);

        const updatedOrder = {
            ...TestOrders.valid,
            item: 'Updated Pizza',
            notes: 'Updated notes'
        };

        await authenticatedPage.updateOrder(updatedOrder);
        await authenticatedPage.expectOrderInList({ item: updatedOrder.item });
    });

    test('should cancel edit and return to create mode', { tag: ['@orders', '@update-order', '@cancel'] }, async ({ authenticatedPage, page }) => {
        await authenticatedPage.editOrder(0);
        await expect(page.locator('h2:has-text("Edit Order")')).toBeVisible();
        await authenticatedPage.navigate('/orders');
        await expect(page.locator('h2:has-text("Create Order")')).toBeVisible();
    });
});