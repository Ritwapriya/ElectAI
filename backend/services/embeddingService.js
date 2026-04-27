const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI = null;
let embeddingModel = null;

function initEmbeddingService() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  }
}

async function generateEmbedding(text) {
  try {
    initEmbeddingService();
    
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    logger.error('Embedding generation failed', { error: error.message });
    
    return generateMockEmbedding(text);
  }
}

async function generateEmbeddings(texts) {
  try {
    initEmbeddingService();
    
    const embeddings = [];
    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  } catch (error) {
    logger.error('Batch embedding generation failed', { error: error.message });
    return texts.map(generateMockEmbedding);
  }
}

function generateMockEmbedding(text) {
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const embedding = [];
  
  for (let i = 0; i < 768; i++) {
    const value = Math.sin(seed * (i + 1)) * Math.cos(seed * (i + 2));
    embedding.push(value);
  }
  
  return embedding;
}

module.exports = {
  generateEmbedding,
  generateEmbeddings
};
