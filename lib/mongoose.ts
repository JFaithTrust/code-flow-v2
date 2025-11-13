import mongoose, { Mongoose } from 'mongoose';

import '@/database';
import logger from './logger';

const MONGO_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, { dbName: 'codeflow' })
      .then((mongoose) => {
        logger.info('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        logger.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
