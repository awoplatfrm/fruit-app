import { Router } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import * as admin from 'firebase-admin';

const router = Router();

// Public test route
router.get('/public', (req, res) => {
    console.log('✅ Public route hit!');
    res.status(200).json({
        success: true,
        message: 'Public route is working!',
        timestamp: new Date().toISOString()
    });
});

// Firebase status check route - ADD THIS EXACTLY
router.get('/firebase-status', (req, res) => {
    console.log('🔥 Firebase status check hit!');

    // Check if Firebase is initialized
    const isInitialized = admin.apps.length > 0;

    // Safely check env vars
    const envStatus = {
        projectId: !!process.env.FIREBASE_PROJECT_ID,
        clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0,
        privateKeyPreview: process.env.FIREBASE_PRIVATE_KEY ?
            process.env.FIREBASE_PRIVATE_KEY.substring(0, 50) + '...' : 'missing'
    };

    res.json({
        initialized: isInitialized,
        appsCount: admin.apps.length,
        envVars: envStatus,
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