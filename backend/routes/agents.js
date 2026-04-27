const express = require('express');
const retrievalAgent = require('../agents/retrievalAgent');
const explanationAgent = require('../agents/explanationAgent');
const timelineAgent = require('../agents/timelineAgent');
const recommendationAgent = require('../agents/recommendationAgent');
const factCheckAgent = require('../agents/factCheckAgent');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const agents = [
      { name: 'RetrievalAgent', status: 'active', type: 'rag' },
      { name: 'ExplanationAgent', status: 'active', type: 'processing' },
      { name: 'TimelineAgent', status: 'active', type: 'data' },
      { name: 'RecommendationAgent', status: 'active', type: 'processing' },
      { name: 'FactCheckAgent', status: 'active', type: 'verification' }
    ];
    
    res.json({
      agents,
      totalActive: agents.length,
      orchestrator: 'active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Agent status error', { error: error.message });
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

router.post('/retrieval', async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const result = await retrievalAgent.execute(query, { topK });
    res.json(result);
  } catch (error) {
    logger.error('Retrieval agent error', { error: error.message });
    res.status(500).json({ error: 'Retrieval agent failed' });
  }
});

router.post('/explanation', async (req, res) => {
  try {
    const { content, explainLevel = 'simple' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await explanationAgent.execute(content, { explainLevel });
    res.json(result);
  } catch (error) {
    logger.error('Explanation agent error', { error: error.message });
    res.status(500).json({ error: 'Explanation agent failed' });
  }
});

router.post('/timeline', async (req, res) => {
  try {
    const { query = '' } = req.body;
    
    const result = await timelineAgent.execute(query);
    res.json(result);
  } catch (error) {
    logger.error('Timeline agent error', { error: error.message });
    res.status(500).json({ error: 'Timeline agent failed' });
  }
});

router.post('/recommendation', async (req, res) => {
  try {
    const { userId, query } = req.body;
    
    const result = await recommendationAgent.execute({ userId, query });
    res.json(result);
  } catch (error) {
    logger.error('Recommendation agent error', { error: error.message });
    res.status(500).json({ error: 'Recommendation agent failed' });
  }
});

router.post('/factcheck', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await factCheckAgent.execute(content);
    res.json(result);
  } catch (error) {
    logger.error('Fact check agent error', { error: error.message });
    res.status(500).json({ error: 'Fact check agent failed' });
  }
});

module.exports = router;
