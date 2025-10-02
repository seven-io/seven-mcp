import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { lookupFormat, lookupRCS, lookupHLR, lookupMNP, lookupCNAM, lookupTools } from '../../tools/lookup.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('Lookup Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('lookupFormat', () => {
    it('should validate phone number format', async () => {
      const params = { number: '+1234567890' };
      const mockResponse = { valid: true, international: '+1234567890', country: 'US' };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await lookupFormat(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/lookup/format', { number: params.number });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('lookupRCS', () => {
    it('should check RCS capabilities', async () => {
      const params = { number: '+1234567890' };
      const mockResponse = { rcs_enabled: true, features: ['text', 'media'] };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await lookupRCS(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/lookup/rcs', { number: params.number });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('lookupHLR', () => {
    it('should perform HLR lookup', async () => {
      const params = { number: '+1234567890' };
      const mockResponse = {
        status: 'active',
        network: 'Verizon',
        roaming: false,
        country: 'US'
      };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await lookupHLR(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/lookup/hlr', { number: params.number });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('lookupMNP', () => {
    it('should perform MNP lookup', async () => {
      const params = { number: '+1234567890' };
      const mockResponse = {
        ported: false,
        original_carrier: 'Verizon',
        current_carrier: 'Verizon'
      };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await lookupMNP(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/lookup/mnp', { number: params.number });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('lookupCNAM', () => {
    it('should perform CNAM lookup', async () => {
      const params = { number: '+1234567890' };
      const mockResponse = { name: 'John Doe', number: '+1234567890' };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await lookupCNAM(mockClient, params);

      expect(mockClient.get).toHaveBeenCalledWith('/lookup/cnam', { number: params.number });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('lookupTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(lookupTools).toHaveLength(5);
      expect(lookupTools[0].name).toBe('lookup_format');
      expect(lookupTools[1].name).toBe('lookup_rcs');
      expect(lookupTools[2].name).toBe('lookup_hlr');
      expect(lookupTools[3].name).toBe('lookup_mnp');
      expect(lookupTools[4].name).toBe('lookup_cnam');
    });

    it('should have required number field in all schemas', () => {
      lookupTools.forEach(tool => {
        expect(tool.inputSchema.required).toContain('number');
      });
    });
  });
});
