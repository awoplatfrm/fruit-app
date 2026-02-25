import { MongoClient, Db, Collection } from 'mongodb';

// Create a variable to hold our database connection
let db: Db;
let client: MongoClient;

// Connect to MongoDB
export const connectToDatabase = async (uri: string): Promise<Db> => {
    try {
        // Create a new MongoClient
        client = new MongoClient(uri);

        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB');

        // Get the database (it will be created if it doesn't exist)
        db = client.db('fruit-marketplace');

        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Get the database instance (for use in other files)
export const getDb = (): Db => {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
};

// Close the database connection (useful for graceful shutdown)
export const closeDatabase = async (): Promise<void> => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
};