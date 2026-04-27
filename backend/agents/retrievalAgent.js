const { searchSimilar } = require('../db/vectorDB');
const { generateEmbedding } = require('../services/embeddingService');
const logger = require('../utils/logger');

class RetrievalAgent {
  constructor() {
    this.name = 'RetrievalAgent';
    this.description = 'Searches vector DB for relevant election documents';
  }

  async execute(query, options = {}) {
    try {
      logger.info(`[${this.name}] Processing query`, { query });
      
      const topK = options.topK || 5;
      
      const queryEmbedding = await generateEmbedding(query);
      
      const searchResults = await searchSimilar(queryEmbedding, topK);
      
      const documents = searchResults.documents[0] || [];
      const distances = searchResults.distances[0] || [];
      const metadatas = searchResults.metadatas[0] || [];
      
      const results = documents.map((doc, index) => ({
        content: doc,
        relevanceScore: 1 - (distances[index] || 0),
        metadata: metadatas[index] || {}
      }));
      
      logger.info(`[${this.name}] Found ${results.length} relevant documents`);
      
      return {
        agent: this.name,
        query,
        documents: results,
        totalFound: results.length,
        success: true
      };
    } catch (error) {
      logger.error(`[${this.name}] Execution failed`, { error: error.message });
      return {
        agent: this.name,
        query,
        documents: [],
        totalFound: 0,
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new RetrievalAgent();
