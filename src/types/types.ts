import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'demo';
    createdAt: Date;
    lastActive?: Date;
}

export interface Fruit {
    _id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    sellerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Listing {
    _id?: string;
    fruitId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    status: 'available' | 'sold' | 'reserved';
    createdAt: Date;
}