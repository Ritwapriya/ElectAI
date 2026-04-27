const { searchSimilar } = require('../db/vectorDB');
const { generateEmbedding } = require('../services/embeddingService');
const { callLLM } = require('../services/llmService');
const logger = require('../utils/logger');

class FactCheckAgent {
  constructor() {
    this.name = 'FactCheckAgent';
    this.description = 'Cross-checks responses with trusted sources to prevent misinformation';
    this.trustedSources = [
      'election commission',
      'government official',
      'verified document',
      'official gazette'
    ];
  }

  async execute(content, options = {}) {
    try {
      logger.info(`[${this.name}] Fact-checking content`, { contentLength: content.length });
      
      const queryEmbedding = await generateEmbedding(content);
      const searchResults = await searchSimilar(queryEmbedding, 3);
      
      const verification = await this.verifyAgainstSources(content, searchResults);
      
      const factCheckResult = {
        agent: this.name,
        originalContent: content,
        verificationStatus: verification.status,
        confidence: verification.confidence,
        supportingEvidence: verification.evidence,
        contradictions: verification.contradictions,
        suggestions: verification.suggestions,
        success: true
      };
      
      logger.info(`[${this.name}] Fact-check complete`, { 
        status: verification.status,
        confidence: verification.confidence 
      });
      
      return factCheckResult;
    } catch (error) {
      logger.error(`[${this.name}] Execution failed`, { error: error.message });
      return {
        agent: this.name,
        originalContent: content,
        verificationStatus: 'uncertain',
        confidence: 0,
        supportingEvidence: [],
        contradictions: [],
        suggestions: ['Unable to verify content'],
        success: false,
        error: error.message
      };
    }
  }

  async verifyAgainstSources(content, searchResults) {
    const documents = searchResults.documents[0] || [];
    const metadatas = searchResults.metadatas[0] || [];
    const distances = searchResults.distances[0] || [];
    
    const evidence = [];
    const contradictions = [];
    
    documents.forEach((doc, index) => {
      const relevance = 1 - (distances[index] || 1);
      if (relevance > 0.7) {
        evidence.push({
          content: doc.substring(0, 200),
          source: metadatas[index]?.source || 'Unknown',
          relevance: Math.round(relevance * 100),
          date: metadatas[index]?.date
        });
      }
    });
    
    const llmVerification = await this.getLLMVerification(content, documents);
    
    let status = 'unverified';
    let confidence = 0;
    
    if (evidence.length >= 2 && llmVerification.isConsistent) {
      status = 'verified';
      confidence = Math.min(95, 70 + (evidence.length * 5));
    } else if (evidence.length === 1 || llmVerification.partialMatch) {
      status = 'partially_verified';
      confidence = 50;
    } else if (llmVerification.hasContradictions) {
      status = 'contradicted';
      confidence = 30;
    } else {
      status = 'unverified';
      confidence = 25;
    }
    
    return {
      status,
      confidence,
      evidence,
      contradictions: llmVerification.contradictions || [],
      suggestions: llmVerification.suggestions || []
    };
  }

  async getLLMVerification(content, sources) {
    try {
      const prompt = `Fact-check this statement against the provided sources:

STATEMENT: ${content}

SOURCES:
${sources.map((s, i) => `[${i + 1}] ${s.substring(0, 300)}`).join('\n\n')}

Analyze and return JSON with these fields:
- isConsistent (boolean): Does the statement align with sources?
- partialMatch (boolean): Is there partial alignment?
- hasContradictions (boolean): Do sources contradict the statement?
- contradictions (array): List any contradictions found
- suggestions (array): Suggestions to correct the statement if needed`;

      const response = await callLLM(prompt, { temperature: 0.1, maxTokens: 800 });
      
      try {
        return JSON.parse(response);
      } catch (e) {
        return {
          isConsistent: false,
          partialMatch: false,
          hasContradictions: false,
          contradictions: [],
          suggestions: ['Unable to parse verification result']
        };
      }
    } catch (error) {
      logger.warn('LLM verification failed');
      return {
        isConsistent: false,
        partialMatch: false,
        hasContradictions: false,
        contradictions: [],
        suggestions: []
      };
    }
  }

  isTrustedSource(metadata) {
    if (!metadata || !metadata.source) return false;
    
    const source = metadata.source.toLowerCase();
    return this.trustedSources.some(trusted => source.includes(trusted));
  }
}

module.exports = new FactCheckAgent();
