// playwright-api-tests/orders.spec.ts
import { test, expect, request, APIRequestContext } from '@playwright/test';
import { SchemaValidator } from '../../utils/schemaValidator';
import { loginAndGetToken } from '../../utils/auth';
import {
    OrderSchema,
    OrderListSchema,
    OrderDeleteFailSchema
} from '../../schemas/order.schemas';
import * as fs from 'fs';
import * as path from 'path';

let apiContext: APIRequestContext;
let authToken: string;

const baseURL = 'http://localhost:4000';

// Fix the path resolution in order.spec.ts
async function createOrderForTest(): Promise<number> {
    // Fix: Go up two directories to reach the correct data folder
    const imagePath = path.resolve(__dirname, '../../data/image.jpg');

    // Add file existence check for better error handling
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Test image not found at: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const multipart = {
        item: 'Pizza',
        deliveryAddress: '123 Road St.',
        quantity: '2',
        phone: '0812345678',
        notes: 'Extra cheese',
        agree: 'true',
        image: {
            name: 'image.jpg',
            mimeType: 'image/jpeg',
            buffer: imageBuffer
        }
    };

    const res = await apiContext.post('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
        multipart
    });

    expect(res.status(), 'Expected successful creation (201)').toBe(201);
    const body = await res.json();
    await test.info().attach('created-order.json', {
        body: JSON.stringify(body, null, 2),
        contentType: 'application/json'
    });
    SchemaValidator.validateResponse(OrderSchema, body);
    return body.id;
}

test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL });
    authToken = await loginAndGetToken(apiContext);
});

test.describe('Orders API CRUD', () => {
    test('POST /orders - create with image', { tag: ['@api', '@orders', '@create', '@positive'] }, async ({ }, testInfo) => {
        const id = await createOrderForTest();
        expect(id, 'Order ID should be defined after creation').toBeDefined();
    });

    test('POST /orders - missing required fields', { tag: ['@api', '@orders', '@create', '@negative', '@validation'] }, async ({ }, testInfo) => {
        const res = await apiContext.post('/api/orders', {
            headers: { Authorization: `Bearer ${authToken}` },
            multipart: {
                deliveryAddress: 'Missing item',
                quantity: '0',
                phone: '123',
                agree: 'true'
            }
        });

        expect(res.status(), 'Expect 400 when missing required fields').toBe(400);
        const body = await res.json();
        await testInfo.attach('validation-error.json', {
            body: JSON.stringify(body, null, 2),
            contentType: 'application/json'
        });
        expect(body.success).toBe(false);
        expect(body.errors).toContain('Item is required');
        expect(body.errors).toContain('Quantity must be a positive number');
        expect(body.errors).toContain('Phone must be 10-15 digits');
    });

    test('GET /orders - list orders', { tag: ['@api', '@orders', '@read', '@positive'] }, async ({ }, testInfo) => {
        const res = await apiContext.get('/api/orders', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(res.status(), 'Expect 200 on GET /orders').toBe(200);
        const data = await res.json();
        await testInfo.attach('orders-list.json', {
            body: JSON.stringify(data, null, 2),
            contentType: 'application/json'
        });
        SchemaValidator.validateResponse(OrderListSchema, data);
    });

    test('PUT /orders/:id - update valid order', { tag: ['@api', '@orders', '@update', '@positive'] }, async ({ }, testInfo) => {
        const id = await createOrderForTest();

        const multipart = {
            item: 'Updated Pizza',
            deliveryAddress: 'Updated Address',
            quantity: '3',
            phone: '0898765432',
            notes: 'Less cheese',
            agree: 'true'
        };

        const res = await apiContext.put(`/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            multipart
        });

        expect(res.status(), 'Expect 200 when updating valid order').toBe(200);
        const body = await res.json();
        await testInfo.attach('updated-order.json', {
            body: JSON.stringify(body, null, 2),
            contentType: 'application/json'
        });
        expect(body.item).toContain('Updated');
        SchemaValidator.validateResponse(OrderSchema, body);
    });

    test('PUT /orders/:id - update with invalid data', { tag: ['@api', '@orders', '@update', '@negative', '@validation'] }, async ({ }, testInfo) => {
        const id = await createOrderForTest();

        const multipart = {
            item: '',
            deliveryAddress: '',
            quantity: '0',
            phone: '',
            agree: 'false'
        };

        const res = await apiContext.put(`/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            multipart
        });

        expect(res.status(), 'Expect 400 when updating with invalid data').toBe(400);
        const body = await res.json();
        await testInfo.attach('update-invalid-response.json', {
            body: JSON.stringify(body, null, 2),
            contentType: 'application/json'
        });
        expect(body.success).toBe(false);
        expect(body.errors.length).toBeGreaterThan(0);
    });

    test('DELETE /orders/:id - success', { tag: ['@api', '@orders', '@delete', '@positive'] }, async ({ }, testInfo) => {
        const id = await createOrderForTest();

        const res = await apiContext.delete(`/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(res.status(), 'Expect 200 on successful delete').toBe(200);
    });

    test('DELETE /orders/:id - not found', { tag: ['@api', '@orders', '@delete', '@negative'] }, async ({ }, testInfo) => {
        const res = await apiContext.delete('/api/orders/9999999', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(res.status(), 'Expect 404 for non-existent delete').toBe(404);
        const body = await res.json();
        await testInfo.attach('delete-not-found.json', {
            body: JSON.stringify(body, null, 2),
            contentType: 'application/json'
        });
        SchemaValidator.validateResponse(OrderDeleteFailSchema, body);
        expect(body.success).toBe(false);
        expect(body.message).toMatch(/not found/i);
    });
});
