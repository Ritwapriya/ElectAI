const retrievalAgent = require('../agents/retrievalAgent');
const factCheckAgent = require('../agents/factCheckAgent');
const explanationAgent = require('../agents/explanationAgent');

describe('AI Agents Unit Tests', () => {
  
  describe('Retrieval Agent', () => {
    test('should execute and return documents for a valid query', async () => {
      const query = "voter registration";
      const result = await retrievalAgent.execute(query);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.documents)).toBe(true);
    });
  });

  describe('Fact-Check Agent', () => {
    test('should identify verified content', async () => {
      const content = "The Election Commission of India (ECI) was established in 1950.";
      const result = await factCheckAgent.execute(content);
      expect(result).toBeDefined();
      expect(result.verificationStatus).toBeDefined();
    });
  });

  describe('Explanation Agent', () => {
    test('should simplify complex text', async () => {
      const complexText = "The Electronic Voting Machine is a microcontroller-based instrument.";
      const result = await explanationAgent.execute(complexText, { level: 'simple' });
      expect(result).toBeDefined();
      expect(result.explanation).toBeDefined();
    });
  });

});
