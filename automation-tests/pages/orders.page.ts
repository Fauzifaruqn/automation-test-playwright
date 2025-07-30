import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { AppSelectors } from '../selectors/app.selectors';
import { OrderData } from '../types/order.types';

export class OrdersPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async expectOrdersPage() {
        await expect(this.page.locator(AppSelectors.orders.createOrderHeading)).toBeVisible();
        await expect(this.page.locator(AppSelectors.orders.ordersListHeading)).toBeVisible();
    }

    async createOrder(orderData: OrderData) {
        await this.fillOrderForm(orderData);
        await this.page.click(AppSelectors.orders.createOrderButton);
    }

    async updateOrder(orderData: OrderData) {
        // Ensure we're in edit mode
        await expect(this.page.locator(AppSelectors.orders.editOrderHeading)).toBeVisible();

        // Clear and fill form
        await this.clearAndFillOrderForm(orderData);

        // Wait for update button to be visible and enabled
        await expect(this.page.locator(AppSelectors.orders.updateOrderButton)).toBeVisible();
        await expect(this.page.locator(AppSelectors.orders.updateOrderButton)).toBeEnabled();

        // Click update button
        await this.page.click(AppSelectors.orders.updateOrderButton);

        // Wait for update to complete (form should switch back to create mode)
        await expect(this.page.locator(AppSelectors.orders.createOrderHeading)).toBeVisible();
    }

    // In orders.page.ts - Add defensive programming
    private async fillOrderForm(orderData: OrderData) {
        // Add null checking
        if (!orderData) {
            throw new Error('Order data is required');
        }

        // Fill form fields with null checks
        if (orderData.item !== undefined) {
            await this.page.fill(AppSelectors.orders.itemInput, orderData.item || '');
        }
        if (orderData.deliveryAddress !== undefined) {
            await this.page.fill(AppSelectors.orders.deliveryAddressInput, orderData.deliveryAddress || '');
        }
        if (orderData.quantity !== undefined) {
            await this.page.fill(AppSelectors.orders.quantityInput, orderData.quantity || '');
        }
        if (orderData.phoneNumber !== undefined) {
            await this.page.fill(AppSelectors.orders.phoneInput, orderData.phoneNumber || '');
        }
        if (orderData.notes !== undefined) {
            await this.page.fill(AppSelectors.orders.notesInput, orderData.notes || '');
        }

        if (orderData.imagePath) {
            await this.uploadOrderImage(orderData.imagePath);
        }
        if (orderData.termsAccepted) {
            await this.page.check(AppSelectors.orders.termsCheckbox);
        }
    }

    private async clearAndFillOrderForm(orderData: OrderData) {
        await this.page.fill(AppSelectors.orders.itemInput, '');
        await this.page.fill(AppSelectors.orders.deliveryAddressInput, '');
        await this.page.fill(AppSelectors.orders.quantityInput, '');
        await this.page.fill(AppSelectors.orders.phoneInput, '');
        await this.page.fill(AppSelectors.orders.notesInput, '');

        await this.fillOrderForm(orderData);
    }

    async editOrder(orderIndex: number = 0) {
        const editButtons = this.page.locator(AppSelectors.orders.editButton);
        await editButtons.nth(orderIndex).click();
        await expect(this.page.locator(AppSelectors.orders.editOrderHeading)).toBeVisible();
    }

    async deleteOrder(orderIndex: number = 0, confirm: boolean = true) {
        const deleteButtons = this.page.locator(AppSelectors.orders.deleteButton);
        await deleteButtons.nth(orderIndex).click();

        // Wait for confirmation dialog
        await expect(this.page.locator(AppSelectors.orders.deleteConfirmation)).toBeVisible();

        if (confirm) {
            await this.page.click(AppSelectors.orders.confirmDeleteButton);
        } else {
            await this.page.click(AppSelectors.orders.cancelDeleteButton);
        }
    }

    async expectOrderInList(orderData: Partial<OrderData>, shouldExist: boolean = true) {
        const ordersList = this.page.locator(AppSelectors.orders.ordersList);

        if (orderData.item) {
            const itemText = ordersList.getByText(orderData.item as string, { exact: true });
            if (shouldExist) {
                await expect(itemText.first()).toBeVisible({ timeout: 10000 });
            } else {
                await expect(itemText.first()).not.toBeVisible({ timeout: 10000 });
            }
        }
    }

    async getOrdersCount(): Promise<number> {
        const orders = this.page.locator(AppSelectors.orders.orderItem);
        return await orders.count();
    }

    async expectEmptyOrdersList() {
        const ordersCount = await this.getOrdersCount();
        expect(ordersCount).toBe(0);
    }

    async logout() {
        await this.page.click(AppSelectors.navigation.logoutButton);
    }

    async uploadOrderImage(filePath: string) {
        await this.page.setInputFiles(AppSelectors.orders.imageUpload, filePath);
    }

    async expectValidationMessage(message: string) {
        await expect(this.page.locator(`text=${message}`)).toBeVisible();
    }


    async expectWhenOrderInvalid() {
        const { validationErrors } = AppSelectors.orders;

        // Method 1: Using individual selectors
        await expect(this.page.locator(validationErrors.itemRequired),
            'Item required error should be visible').toBeVisible();

        await expect(this.page.locator(validationErrors.addressRequired),
            'Address required error should be visible').toBeVisible();

        await expect(this.page.locator(validationErrors.quantityInvalid),
            'Quantity invalid error should be visible').toBeVisible();

        await expect(this.page.locator(validationErrors.phoneInvalid),
            'Phone invalid error should be visible').toBeVisible();

        await expect(this.page.locator(validationErrors.imageRequired),
            'Image required error should be visible').toBeVisible();

        await expect(this.page.locator(validationErrors.termsRequired),
            'Terms required error should be visible').toBeVisible();
    }

    // Add this method to your OrdersPage class
    async clearAllOrders() {
        try {
            console.log('Starting clearAllOrders...');

            let ordersCount = await this.getOrdersCount();
            console.log(`Initial orders count: ${ordersCount}`);

            const maxAttempts = 10;
            let attempts = 0;

            while (ordersCount > 0 && attempts < maxAttempts) {
                console.log(`Attempt ${attempts + 1}: ${ordersCount} orders remaining`);

                // Get fresh locator for delete buttons
                const deleteButtons = this.page.locator(AppSelectors.orders.deleteButton);
                const buttonCount = await deleteButtons.count();
                console.log(`Delete buttons found: ${buttonCount}`);

                if (buttonCount === 0) {
                    console.warn('No delete buttons found but orders exist');
                    break;
                }

                // Always delete the first order (index 0) to avoid index shifting
                await deleteButtons.first().click();
                console.log('Clicked delete button');

                // Handle confirmation dialog
                try {
                    await expect(this.page.locator(AppSelectors.orders.deleteConfirmation))
                        .toBeVisible({ timeout: 5000 });
                    await this.page.click(AppSelectors.orders.confirmDeleteButton);
                    console.log('Confirmed deletion');

                    // Wait for order to be removed with polling
                    await expect.poll(async () => {
                        const newCount = await this.getOrdersCount();
                        console.log(`Polling count: ${newCount}`);
                        return newCount;
                    }, {
                        message: 'Order should be deleted',
                        timeout: 10000,
                        intervals: [500, 1000]
                    }).toBeLessThan(ordersCount);

                } catch (confirmError) {
                    console.error('Error in confirmation dialog:', confirmError);
                    // Try to close any open dialogs
                    const cancelButton = this.page.locator(AppSelectors.orders.cancelDeleteButton);
                    if (await cancelButton.isVisible()) {
                        await cancelButton.click();
                    }
                    break;
                }

                // Update count for next iteration
                const newCount = await this.getOrdersCount();
                console.log(`New count after deletion: ${newCount}`);

                if (newCount >= ordersCount) {
                    console.error('Order count did not decrease!');
                    await this.page.screenshot({ path: `debug-no-decrease-${Date.now()}.png` });
                    break;
                }

                ordersCount = newCount;
                attempts++;
            }

            const finalCount = await this.getOrdersCount();
            console.log(`Final orders count: ${finalCount}`);

            if (finalCount > 0) {
                console.warn(`Could not clear all orders. Remaining: ${finalCount}`);
                await this.page.screenshot({ path: `debug-remaining-orders-${Date.now()}.png` });
                // Don't throw error, just log warning for now
            }

        } catch (error) {
            console.error('Error in clearAllOrders:', error);
            await this.page.screenshot({ path: `debug-clear-error-${Date.now()}.png` });
            throw error;
        }
    }
}