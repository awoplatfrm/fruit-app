import { Request, Response } from 'express';
import { getDb } from '../models/database';
import { AuthRequest } from '../middleware/auth';
import { ObjectId } from 'mongodb';
import { Fruit, CreateFruitDTO, UpdateFruitDTO } from '../types/fruits';

// Get all fruits (public)
export const getFruits = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const fruits = await db.collection('fruits')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ success: true, fruits });
    } catch (error) {
        console.error('Get fruits error:', error);
        res.status(500).json({ error: 'Failed to fetch fruits' });
    }
};

// Get single fruit (public)
export const getFruitById = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        // Ensure id is a string
        const id = req.params.id as string;

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid fruit ID format' });
        }

        const fruit = await db.collection('fruits').findOne({
            _id: new ObjectId(id)
        });

        if (!fruit) {
            return res.status(404).json({ error: 'Fruit not found' });
        }

        res.json({ success: true, fruit });
    } catch (error) {
        console.error('Get fruit error:', error);
        res.status(500).json({ error: 'Failed to fetch fruit' });
    }
};

// Create fruit (authenticated users only)
export const createFruit = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, quantity, imageUrl } = req.body as CreateFruitDTO;

        // Validate required fields
        if (!name || !description || !price || !quantity) {
            return res.status(400).json({
                error: 'Missing required fields: name, description, price, quantity'
            });
        }

        const db = getDb();
        const newFruit: Fruit = {
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
            sellerId: req.user!.uid,
            sellerEmail: req.user!.email || '',
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('fruits').insertOne(newFruit);

        res.status(201).json({
            success: true,
            message: 'Fruit created successfully',
            fruitId: result.insertedId
        });
    } catch (error) {
        console.error('Create fruit error:', error);
        res.status(500).json({ error: 'Failed to create fruit' });
    }
};

// Update fruit (owner or admin only)
export const updateFruit = async (req: AuthRequest, res: Response) => {
    try {
        // Ensure id is a string
        const id = req.params.id as string;
        const updates = req.body as UpdateFruitDTO;

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid fruit ID format' });
        }

        const db = getDb();
        const fruit = await db.collection('fruits').findOne({
            _id: new ObjectId(id)
        });

        if (!fruit) {
            return res.status(404).json({ error: 'Fruit not found' });
        }

        // Check if user is the seller
        if (fruit.sellerId !== req.user!.uid) {
            return res.status(403).json({ error: 'Not authorized to update this fruit' });
        }

        const updateData: any = {
            ...updates,
            updatedAt: new Date()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await db.collection('fruits').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        res.json({ success: true, message: 'Fruit updated successfully' });
    } catch (error) {
        console.error('Update fruit error:', error);
        res.status(500).json({ error: 'Failed to update fruit' });
    }
};

// Delete fruit (owner or admin only)
export const deleteFruit = async (req: AuthRequest, res: Response) => {
    try {
        // Ensure id is a string
        const id = req.params.id as string;

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid fruit ID format' });
        }

        const db = getDb();
        const fruit = await db.collection('fruits').findOne({
            _id: new ObjectId(id)
        });

        if (!fruit) {
            return res.status(404).json({ error: 'Fruit not found' });
        }

        // Check if user is the seller
        if (fruit.sellerId !== req.user!.uid) {
            return res.status(403).json({ error: 'Not authorized to delete this fruit' });
        }

        await db.collection('fruits').deleteOne({ _id: new ObjectId(id) });

        res.json({ success: true, message: 'Fruit deleted successfully' });
    } catch (error) {
        console.error('Delete fruit error:', error);
        res.status(500).json({ error: 'Failed to delete fruit' });
    }
};