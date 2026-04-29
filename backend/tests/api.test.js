const request = require('supertest');
const app = require('../server'); // Import the express app

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-route-12345');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
