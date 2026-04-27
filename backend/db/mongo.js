const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

let db = null;
let client = null;

async function connectMongoDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/election_education';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    logger.info('Connected to MongoDB');
    return db;
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

async function closeMongoDB() {
  if (client) {
    await client.close();
    logger.info('MongoDB connection closed');
  }
}

module.exports = {
  connectMongoDB,
  getDB,
  closeMongoDB
};
