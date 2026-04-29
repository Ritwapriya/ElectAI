const agentRouter = require('../orchestrator/agentRouter');

describe('Orchestrator Agent Router', () => {
  test('should route voting registration queries to the retrieval agent', async () => {
    const query = "How do I register to vote?";
    const context = { stateId: 'delhi' };
    const result = await agentRouter.route(query, context);
    
    expect(result).toBeDefined();
    expect(result.response).toBeDefined();
  });

  test('should handle timeline queries appropriately', async () => {
    const query = "When is the next election in West Bengal?";
    const context = { stateId: 'west-bengal' };
    const result = await agentRouter.route(query, context);
    
    expect(result).toBeDefined();
    expect(result.intent).toBeDefined();
  });

  test('should provide a fallback for out-of-domain queries', async () => {
    const query = "How do I bake a cake?";
    const context = {};
    const result = await agentRouter.route(query, context);
    
    expect(result.response).toContain('Election');
  });
});
