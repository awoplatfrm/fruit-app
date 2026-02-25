import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../react-native-test-app-2210e-firebase-adminsdk-fbsvc-e2501865f8.json';

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    console.log('Firebase Admin initialized');
}

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const verifyToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the token using Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user info to request
        req.user = decodedToken;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};