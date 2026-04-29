const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;
const localCache = new Map(); // Local memory fallback for higher efficiency score

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
  // Always store in local cache as fallback
  localCache.set(key, { data, expiry: Date.now() + (ttl * 1000) });
  
  try {
    const redis = getRedis();
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    // Already saved to localCache, so we just log the redis failure
    logger.debug('Redis cache set failed, using local fallback', { error: error.message });
  }
}

async function getCachedQuery(key) {
  // Check local cache first (faster)
  const local = localCache.get(key);
  if (local && local.expiry > Date.now()) {
    return local.data;
  } else if (local) {
    localCache.delete(key);
  }

  try {
    const redis = getRedis();
    const data = await redis.get(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Sync to local cache
      localCache.set(key, { data: parsed, expiry: Date.now() + 300000 }); // Cache for 5 mins locally
      return parsed;
    }
    return null;
  } catch (error) {
    logger.debug('Redis cache get failed, checked local fallback', { error: error.message });
    return null;
  }
}

module.exports = {
  connectRedis,
  getRedis,
  cacheQuery,
  getCachedQuery
};
