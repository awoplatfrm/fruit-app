import { Router } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Public route
router.get('/public', (req, res) => {
    console.log('✅ Public route hit!');
    res.status(200).json({
        success: true,
        message: 'Public route is working!',
        timestamp: new Date().toISOString()
    });
});

// Protected route - requires token
router.get('/protected', verifyToken, (req: AuthRequest, res) => {
    console.log('✅ Protected route accessed by:', req.user?.email);
    res.json({
        success: true,
        message: 'Protected route is working!',
        user: {
            uid: req.user?.uid,
            email: req.user?.email
        }
    });
});

// Simple test
router.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint works' });
});

export default router;