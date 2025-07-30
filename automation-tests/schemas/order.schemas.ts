export const OrderSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        userId: { type: 'number' },
        item: { type: 'string' },
        deliveryAddress: { type: 'string' },
        quantity: { type: 'number' },
        phone: { type: 'string' },
        notes: { type: 'string' },
        agree: { type: 'boolean' },
        status: { type: 'string' },
        imageUrl: { type: ['string', 'null'] }
    },
    required: ['id', 'userId', 'item', 'deliveryAddress', 'quantity', 'phone', 'agree', 'status', 'imageUrl'],
    additionalProperties: false
};

export const OrderListSchema = {
    type: 'array',
    items: OrderSchema
};

export const OrderDeleteSuccessSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
    },
    required: ['success', 'message'],
    additionalProperties: false
};

export const OrderDeleteFailSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
    },
    required: ['success', 'message'],
    additionalProperties: false
};
