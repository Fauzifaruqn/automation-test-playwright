import { test, expect } from '../../../fixtures/auth.fixture';
import { TestOrders } from '../../../data/test-data';

test.describe('Create Order Functionality', () => {
    test('should create order with valid data', {
        tag: ['@smoke', '@orders', '@critical']
    }, async ({ authenticatedPage }) => {
        const initialCount = await authenticatedPage.getOrdersCount();
        await authenticatedPage.createOrder(TestOrders.valid);
        await authenticatedPage.expectOrderInList({ item: TestOrders.valid.item });

        const newCount = await authenticatedPage.getOrdersCount();
        expect(newCount, `Expectation ${newCount}: Order count should increase by 1 after creating a new order`).toBe(initialCount + 1);
    });

    test('should show validation errors for invalid data', {
        tag: ['@validation', '@orders', '@regression']
    }, async ({ authenticatedPage, page }) => {
        await authenticatedPage.createOrder(TestOrders.invalid);
        const initialOrdersCount = await authenticatedPage.getOrdersCount();
        await authenticatedPage.expectWhenOrderInvalid();
        await page.waitForTimeout(1000);
        const finalOrdersCount = await authenticatedPage.getOrdersCount();
        expect(finalOrdersCount, `Expectation ${finalOrdersCount}: Order count should remain the same after invalid submission`).toBe(initialOrdersCount);
    });

    test('should require terms acceptance', {
        tag: ['@validation', '@orders', '@regression']
    }, async ({ authenticatedPage }) => {
        await authenticatedPage.createOrder({
            ...TestOrders.valid,
            termsAccepted: false
        });
        await authenticatedPage.expectValidationMessage('You must accept the terms');
    });
});