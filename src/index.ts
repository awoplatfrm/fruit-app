import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './models/database';
import testRoutes from './routes/testRoutes';
import fruitRoutes from './routes/fruits';  // Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Allow all connections
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase(process.env.MONGODB_URI!)
    .then(() => {
        console.log('✅ Database connected');

        // Test endpoint
        app.get('/ping', (req, res) => {
            console.log('📡 Ping received from:', req.ip);
            res.json({
                message: 'pong',
                time: new Date().toISOString(),
                ip: req.ip
            });
        });

        // Routes
        app.use('/api/test', testRoutes);
        app.use('/api/fruits', fruitRoutes);  // Add this line

        // Listen on ALL network interfaces
        app.listen(5001, '0.0.0.0', () => {
            console.log(`✅ Server is running!`);
            console.log(`📍 Local URL: http://localhost:${PORT}`);
            console.log(`📱 Phone URL: http://172.20.10.2:${PORT}`);
            console.log(`\n🔍 Test endpoints:`);
            console.log(`   GET  /ping`);
            console.log(`   GET  /api/test/public`);
            console.log(`   GET  /api/test/protected`);
            console.log(`\n🍎 Fruit endpoints:`);
            console.log(`   GET    /api/fruits (public)`);
            console.log(`   GET    /api/fruits/:id (public)`);
            console.log(`   POST   /api/fruits (auth)`);
            console.log(`   PUT    /api/fruits/:id (auth)`);
            console.log(`   DELETE /api/fruits/:id (auth)`);
        });
    })
    .catch(console.error);