import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
    getFruits,
    getFruitById,
    createFruit,
    updateFruit,
    deleteFruit
} from '../controller/fruitController';

const router = Router();

// Public routes
router.get('/', getFruits);
router.get('/:id', getFruitById);

// Protected routes (require authentication)
router.post('/', verifyToken, createFruit);
router.put('/:id', verifyToken, updateFruit);
router.delete('/:id', verifyToken, deleteFruit);

export default router;