import mongoose, { Connection } from 'mongoose';

const { MONGODB_URI } = process.env;

let cachedConnection: Connection | null = null;

export async function connectToDatabase(mongodbUrl = MONGODB_URI) {
  if (cachedConnection) {
    return { db: cachedConnection };
  }

  const connection = await mongoose.connect(mongodbUrl)
  cachedConnection = connection.connection;

  return { db: cachedConnection };
}
