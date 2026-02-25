import { ObjectId } from 'mongodb';

export interface Fruit {
    _id?: ObjectId;  // Change from string to ObjectId
    name: string;
    description: string;
    price: number;
    quantity: number;
    sellerId: string;      // Firebase UID
    sellerEmail: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFruitDTO {
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface UpdateFruitDTO {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    imageUrl?: string;
}