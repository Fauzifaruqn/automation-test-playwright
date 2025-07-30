export interface OrderData {
    item: string;
    deliveryAddress: string;
    quantity: string;
    phoneNumber: string;
    notes: string;
    termsAccepted: boolean;
    imagePath?: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    DELIVERED = 'delivered'
}
