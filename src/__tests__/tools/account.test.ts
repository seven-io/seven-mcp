import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getBalance, getPricing, getAnalytics, accountTools } from '../../tools/account.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('Account Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('getBalance', () => {
    it('should get account balance', async () => {
      const mockResponse = { balance: 100.50, currency: 'EUR' };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getBalance(mockClient);

      expect(mockClient.get).toHaveBeenCalledWith('/balance');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPricing', () => {
    it('should get pricing without parameters', async () => {
      const mockResponse = { countries: [] };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getPricing(mockClient);

      expect(mockClient.get).toHaveBeenCalledWith('/pricing', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should get pricing for specific country', async () => {
      const params = { country: 'DE' };
      const mockResponse = { country: 'DE', price_per_sms: 0.075 };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getPricing(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/pricing', params);
      expect(result).toEqual(mockResponse);
    });

    it('should get pricing with format parameter', async () => {
      const params = { format: 'csv' };
      mockClient.get.mockReturnValue(mockSuccessResponse('csv,data'));

      await getPricing(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/pricing', params);
    });
  });

  describe('getAnalytics', () => {
    it('should get analytics without parameters', async () => {
      const mockResponse = { total_sent: 1000 };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getAnalytics(mockClient);

      expect(mockClient.get).toHaveBeenCalledWith('/analytics', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should get analytics with date range', async () => {
      const params = { start: '2024-01-01', end: '2024-01-31' };
      const mockResponse = { total_sent: 500, period: '2024-01' };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getAnalytics(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/analytics', params);
      expect(result).toEqual(mockResponse);
    });

    it('should get analytics including subaccounts', async () => {
      const params = { subaccounts: true };
      mockClient.get.mockReturnValue(mockSuccessResponse({ success: true }));

      await getAnalytics(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/analytics', params);
    });
  });

  describe('accountTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(accountTools).toHaveLength(3);
      expect(accountTools[0].name).toBe('get_balance');
      expect(accountTools[1].name).toBe('get_pricing');
      expect(accountTools[2].name).toBe('get_analytics');
    });
  });
});
