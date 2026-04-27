const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

async function connectRedis() {
  let client = null;
  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    client = createClient({
      url,
      socket: {
        connectTimeout: 3000,
        reconnectStrategy: (retries) => Math.min(retries * 100, 2000)
      }
    });

    client.on('error', (err) => {
      logger.debug('Redis error: ' + err.message);
    });

    await client.connect();
    redisClient = client;
    logger.info('Connected to Redis');
    return redisClient;
  } catch (error) {
    logger.warn('Redis connection failed (working without cache): ' + error.message);
    if (client) {
      try { await client.disconnect(); } catch (_) {}
    }
    redisClient = null;
    return null;
  }
}

function getRedis() {
  if (!redisClient) {
    throw new Error('Redis not connected');
  }
  return redisClient;
}

async function cacheQuery(key, data, ttl = 3600) {
  try {
    const redis = getRedis();
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    logger.error('Cache set failed', { error: error.message });
  }
}

async function getCachedQuery(key) {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Cache get failed', { error: error.message });
    return null;
  }
}

module.exports = {
  connectRedis,
  getRedis,
  cacheQuery,
  getCachedQuery
};
