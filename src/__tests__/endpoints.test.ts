import { describe, it, expect } from '@jest/globals';
import { SevenClient } from '../client.js';

/**
 * Integration tests to validate that endpoint paths are correct.
 * These tests ensure we're calling the right seven.io API endpoints.
 *
 * Note: These tests will fail without a valid API key.
 * Set SEVEN_API_KEY environment variable to run these tests.
 */
describe('Endpoint Validation', () => {
  const apiKey = process.env.SEVEN_API_KEY;

  // Skip tests if no API key is provided
  const testIf = (condition: boolean) => condition ? it : it.skip;

  describe('Journal/Logbook Endpoints', () => {
    testIf(!!apiKey)('should use correct endpoint for journal/outbound', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      // This should not return 404
      try {
        await client.get('/journal/outbound', { limit: 1 });
      } catch (error: any) {
        // We expect potential auth errors, but NOT 404
        expect(error.response?.status).not.toBe(404);
      }
    });

    testIf(!!apiKey)('should use correct endpoint for journal/inbound', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        await client.get('/journal/inbound', { limit: 1 });
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });

    testIf(!!apiKey)('should use correct endpoint for journal/voice', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        await client.get('/journal/voice', { limit: 1 });
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });
  });

  describe('Account Endpoints', () => {
    testIf(!!apiKey)('should use correct endpoint for balance', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        await client.get('/balance');
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });

    testIf(!!apiKey)('should use correct endpoint for pricing', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        await client.get('/pricing');
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });

    testIf(!!apiKey)('should use correct endpoint for analytics', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        await client.get('/analytics');
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });
  });

  describe('Status Endpoint', () => {
    testIf(!!apiKey)('should use correct endpoint for status', async () => {
      const client = new SevenClient({ apiKey: apiKey! });

      try {
        // Status requires msg_id, so we expect error but not 404
        await client.get('/status');
      } catch (error: any) {
        expect(error.response?.status).not.toBe(404);
      }
    });
  });

  // Info message if tests are skipped
  if (!apiKey) {
    it('should skip endpoint validation tests without API key', () => {
      expect(true).toBe(true);
      console.log('\n⚠️  Skipping endpoint validation tests - Set SEVEN_API_KEY to run these tests\n');
    });
  }
});
