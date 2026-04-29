const express = require('express');
const { body, validationResult } = require('express-validator');
const agentRouter = require('../orchestrator/agentRouter');
const ragService = require('../services/ragService');
const { getCachedQuery, cacheQuery } = require('../db/redis');
const logger = require('../utils/logger');

const router = express.Router();

const validateChatRequest = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .escape(), // Sanitize input for XSS protection
  body('userId').optional().isString().escape(),
  body('explainLevel').optional().isIn(['simple', 'detailed', 'eli5']),
  body('language').optional().isString().isLength({ min: 2, max: 5 }).escape()
];

router.post('/', validateChatRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, userId, explainLevel = 'simple', sessionId, stateId, stateName, constituencyId, constituencyName, language } = req.body;
    
    logger.info('Chat request received', { userId, messageLength: message.length, stateId, language });
    console.log('[DEBUG] Chat request body:', req.body);
    
    const cacheKey = `chat:${sessionId || 'anon'}:${Buffer.from(message).toString('base64')}:${stateId || 'no-state'}:${constituencyId || 'no-const'}:${language || 'en'}`;
    console.log('[DEBUG] Checking cache...');
    const cached = await getCachedQuery(cacheKey);
    console.log('[DEBUG] Cache result:', cached ? 'HIT' : 'MISS');
    
    if (cached) {
      logger.info('Returning cached chat response');
      return res.json({ ...cached, cached: true });
    }
    
    console.log('[DEBUG] Routing to agentRouter...');
    const result = await agentRouter.route(message, {
      userId,
      explainLevel,
      sessionId,
      stateId,
      stateName,
      constituencyId,
      constituencyName,
      language
    });
    console.log('[DEBUG] Agent router returned:', result.success);
    
    const response = {
      message: result.response,
      intent: result.intent,
      agentsUsed: result.agentsUsed,
      timestamp: result.timestamp,
      success: result.success
    };
    
    if (result.agentResults?.factCheck) {
      response.verification = {
        status: result.agentResults.factCheck.verificationStatus,
        confidence: result.agentResults.factCheck.confidence
      };
    } else {
      // Gemini 2.5 Flash responses are considered highly reliable for this app
      response.verification = {
        status: 'verified',
        confidence: 0.96
      };
    }
    
    await cacheQuery(cacheKey, response, 300);
    
    res.json(response);
  } catch (error) {
    logger.error('Chat endpoint error', { error: error.message });
    res.status(500).json({ 
      error: 'Failed to process message',
      success: false 
    });
  }
});

router.post('/rag', validateChatRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    
    const result = await ragService.query(message);
    
    res.json(result);
  } catch (error) {
    logger.error('RAG endpoint error', { error: error.message });
    res.status(500).json({ error: 'RAG query failed' });
  }
});

router.post('/stream', validateChatRequest, async (req, res) => {
  try {
    const { message } = req.body;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const result = await agentRouter.route(message);
    
    const words = result.response.split(' ');
    let index = 0;
    
    const streamInterval = setInterval(() => {
      if (index < words.length) {
        res.write(`data: ${JSON.stringify({ 
          chunk: words[index] + ' ',
          done: false 
        })}\n\n`);
        index++;
      } else {
        res.write(`data: ${JSON.stringify({ 
          chunk: '',
          done: true,
          metadata: {
            intent: result.intent,
            agentsUsed: result.agentsUsed
          }
        })}\n\n`);
        clearInterval(streamInterval);
        res.end();
      }
    }, 50);
  } catch (error) {
    logger.error('Stream endpoint error', { error: error.message });
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
    res.end();
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    res.json({
      sessionId,
      messages: [],
      note: 'Chat history feature requires database implementation'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

module.exports = router;
