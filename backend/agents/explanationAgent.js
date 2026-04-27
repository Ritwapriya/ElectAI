const { callLLM } = require('../services/llmService');
const logger = require('../utils/logger');

class ExplanationAgent {
  constructor() {
    this.name = 'ExplanationAgent';
    this.description = 'Converts complex election info into simple explanations';
  }

  async execute(content, options = {}) {
    try {
      logger.info(`[${this.name}] Creating explanation`, { contentLength: content.length });
      
      const level = options.explainLevel || 'simple'; // simple, detailed, 'eli5'
      
      const prompt = this.buildPrompt(content, level);
      
      const response = await callLLM(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      });
      
      logger.info(`[${this.name}] Explanation generated`);
      
      return {
        agent: this.name,
        originalContent: content,
        explanation: response,
        level,
        success: true
      };
    } catch (error) {
      logger.error(`[${this.name}] Execution failed`, { error: error.message });
      return {
        agent: this.name,
        originalContent: content,
        explanation: null,
        level: options.explainLevel,
        success: false,
        error: error.message
      };
    }
  }

  buildPrompt(content, level) {
    const prompts = {
      simple: `Explain this election information in simple, clear steps that anyone can understand:

Content: ${content}

Provide a clear, step-by-step explanation.`,
      
      detailed: `Provide a comprehensive explanation of this election information:

Content: ${content}

Include background context, detailed steps, and important considerations.`,
      
      eli5: `Explain this election information like I'm 10 years old:

Content: ${content}

Use simple language, analogies, and examples a child would understand. Keep it friendly and engaging.`
    };
    
    return prompts[level] || prompts.simple;
  }
}

module.exports = new ExplanationAgent();
