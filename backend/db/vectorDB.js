const { ChromaClient } = require('chromadb');
const logger = require('../utils/logger');

let chromaClient = null;
let collection = null;

const COLLECTION_NAME = 'election_documents';

async function initVectorDB() {
  try {
    const chromaPath = process.env.CHROMA_DB_PATH || 'http://localhost:8000';
    // If it's a relative path, Chroma JS client will fail. Default to localhost.
    const finalPath = chromaPath.startsWith('http') ? chromaPath : 'http://localhost:8000';
    
    chromaClient = new ChromaClient({
      path: finalPath
    });
    
    collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { description: 'Election education documents' }
    });
    
    logger.info('Vector DB initialized');
    return collection;
  } catch (error) {
    logger.warn('Vector DB connection failed (skipping): ' + error.message);
    // Don't throw, just let it be null. Services using it should handle it.
    return null;
  }
}

async function addDocuments(documents, embeddings, ids, metadata = []) {
  try {
    if (!collection) await initVectorDB();
    
    await collection.add({
      ids,
      embeddings,
      documents,
      metadatas: metadata
    });
    
    logger.info(`Added ${documents.length} documents to vector DB`);
  } catch (error) {
    logger.error('Failed to add documents', { error: error.message });
    throw error;
  }
}

async function searchSimilar(queryEmbedding, topK = 5) {
  try {
    if (!collection) await initVectorDB();
    
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK
    });
    
    return results;
  } catch (error) {
    logger.error('Vector search failed', { error: error.message });
    return { ids: [[]], documents: [[]], distances: [[]], metadatas: [[]] };
  }
}

async function getCollectionStats() {
  try {
    if (!collection) await initVectorDB();
    const count = await collection.count();
    return { totalDocuments: count };
  } catch (error) {
    logger.error('Failed to get stats', { error: error.message });
    return { totalDocuments: 0 };
  }
}

module.exports = {
  initVectorDB,
  addDocuments,
  searchSimilar,
  getCollectionStats
};
