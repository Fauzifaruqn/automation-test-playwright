import { OrderData, UserCredentials } from '../types/order.types';
import { faker } from '@faker-js/faker';
const path = require('path');

export const TestUsers: Record<string, UserCredentials> = {
    valid: {
        username: 'fauzi',
        password: 'test1234'
    },
    invalid: {
        username: 'invalid',
        password: 'wrong'
    },
    empty: {
        username: '',
        password: ''
    }
} as const;

const createOrderData = (overrides: Partial<OrderData> = {}): OrderData => ({
    item: faker.food.dish(),
    deliveryAddress: faker.location.streetAddress(),
    quantity: '2',
    phoneNumber: faker.string.numeric(10),
    notes: 'Test order notes',
    termsAccepted: true,
    imagePath: path.resolve(__dirname, '../data/image.jpg'),
    ...overrides
});


export const TestOrders: Record<string, OrderData> = {
    valid: createOrderData(),
    minimal: createOrderData({
        quantity: '1',
        phoneNumber: faker.string.numeric(12),
        imagePath: path.resolve(__dirname, '../data/imageupdate.jpg'),
    }),
    invalid: {
        item: '',
        deliveryAddress: '',
        quantity: '0',
        phoneNumber: 'invalid',
        notes: '',
        termsAccepted: false
    }
} as const;