const { generateEmbedding } = require('./embeddingService');
const { callLLM } = require('./llmService');
const { searchSimilar } = require('../db/vectorDB');
const { getCachedQuery, cacheQuery } = require('../db/redis');
const logger = require('../utils/logger');

class RAGService {
  constructor() {
    this.cacheEnabled = true;
    this.defaultTopK = 5;
  }

  async query(userQuery, options = {}) {
    try {
      logger.info('[RAGService] Processing query', { query: userQuery });
      
      if (this.cacheEnabled) {
        const cacheKey = `rag:${Buffer.from(userQuery).toString('base64')}`;
        const cached = await getCachedQuery(cacheKey);
        if (cached) {
          logger.info('[RAGService] Returning cached response');
          return cached;
        }
      }
      
      const topK = options.topK || this.defaultTopK;
      
      const queryEmbedding = await generateEmbedding(userQuery);
      
      const searchResults = await searchSimilar(queryEmbedding, topK);
      
      const context = this.buildContext(searchResults);
      
      const answer = await this.generateAnswer(userQuery, context, options);
      
      const response = {
        query: userQuery,
        answer,
        sources: this.extractSources(searchResults),
        confidence: this.calculateConfidence(searchResults),
        timestamp: new Date().toISOString()
      };
      
      if (this.cacheEnabled) {
        const cacheKey = `rag:${Buffer.from(userQuery).toString('base64')}`;
        await cacheQuery(cacheKey, response, options.cacheTtl || 3600);
      }
      
      logger.info('[RAGService] Query processed successfully');
      
      return response;
    } catch (error) {
      logger.error('[RAGService] Query failed', { error: error.message });
      
      return {
        query: userQuery,
        answer: "I'm sorry, I couldn't process your question at this time. Please try again.",
        sources: [],
        confidence: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  buildContext(searchResults) {
    const documents = searchResults.documents[0] || [];
    const metadatas = searchResults.metadatas[0] || [];
    const distances = searchResults.distances[0] || [];
    
    const sortedDocs = documents
      .map((doc, i) => ({ 
        content: doc, 
        metadata: metadatas[i] || {},
        relevance: 1 - (distances[i] || 0)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .filter(item => item.relevance > 0.5);
    
    return sortedDocs.map(item => ({
      content: item.content,
      source: item.metadata.source || 'Unknown',
      date: item.metadata.date,
      relevance: Math.round(item.relevance * 100)
    }));
  }

  async generateAnswer(query, context, options) {
    const contextText = context.map((item, i) => 
      `[Source ${i + 1}] ${item.content} (Source: ${item.source})`
    ).join('\n\n');
    
    const prompt = `You are an expert election education assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain enough information, say so honestly.

Context:
${contextText}

User Question: ${query}

Instructions:
1. Provide a clear, accurate answer
2. Cite sources using [Source X] notation
3. If uncertain, acknowledge limitations
4. Keep the tone helpful and educational
5. Use simple language unless technical terms are necessary

Answer:`;

    return await callLLM(prompt, {
      temperature: options.temperature || 0.3,
      maxTokens: options.maxTokens || 1000
    });
  }

  extractSources(searchResults) {
    const documents = searchResults.documents[0] || [];
    const metadatas = searchResults.metadatas[0] || [];
    const distances = searchResults.distances[0] || [];
    
    return documents.map((doc, i) => ({
      content: doc.substring(0, 200) + '...',
      source: metadatas[i]?.source || 'Unknown',
      date: metadatas[i]?.date,
      relevance: Math.round((1 - (distances[i] || 0)) * 100)
    }));
  }

  calculateConfidence(searchResults) {
    const distances = searchResults.distances[0] || [];
    if (distances.length === 0) return 0;
    
    const avgRelevance = distances.reduce((a, b) => a + (1 - b), 0) / distances.length;
    return Math.round(avgRelevance * 100);
  }

  async indexDocument(content, metadata = {}) {
    try {
      const { generateEmbeddings } = require('./embeddingService');
      const { addDocuments } = require('../db/vectorDB');
      const { v4: uuidv4 } = require('uuid');
      
      const chunks = this.chunkDocument(content);
      const embeddings = await generateEmbeddings(chunks);
      const ids = chunks.map(() => uuidv4());
      const metadatas = chunks.map(() => metadata);
      
      await addDocuments(chunks, embeddings, ids, metadatas);
      
      logger.info(`[RAGService] Indexed document with ${chunks.length} chunks`);
      
      return { success: true, chunksIndexed: chunks.length };
    } catch (error) {
      logger.error('[RAGService] Indexing failed', { error: error.message });
      throw error;
    }
  }

  chunkDocument(content, maxChunkSize = 500) {
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    
    return chunks.length > 0 ? chunks : [content];
  }
}

module.exports = new RAGService();
