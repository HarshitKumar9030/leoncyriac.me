import mongoose, { Mongoose } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function connectDb(): Promise<Mongoose> {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
    };

    global.mongoose.promise = mongoose.connect(MONGO_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectDb;
