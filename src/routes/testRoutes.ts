import { Router } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import * as admin from 'firebase-admin';

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

router.get('/firebase-status', (req, res) => {
    const status = {
        initialized: admin.apps.length > 0,
        appsCount: admin.apps.length,
        envVars: {
            projectId: {
                exists: !!process.env.FIREBASE_PROJECT_ID,
                value: process.env.FIREBASE_PROJECT_ID ? 'set' : 'missing'
            },
            clientEmail: {
                exists: !!process.env.FIREBASE_CLIENT_EMAIL,
                value: process.env.FIREBASE_CLIENT_EMAIL ? 'set' : 'missing'
            },
            privateKey: {
                exists: !!process.env.FIREBASE_PRIVATE_KEY,
                length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
                preview: process.env.FIREBASE_PRIVATE_KEY ?
                    process.env.FIREBASE_PRIVATE_KEY.substring(0, 50) + '...' : 'missing'
            }
        },
        timestamp: new Date().toISOString()
    };
    res.json(status);
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