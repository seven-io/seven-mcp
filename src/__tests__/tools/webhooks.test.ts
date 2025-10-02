import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { listWebhooks, createWebhook, deleteWebhook, webhooksTools } from '../../tools/webhooks.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('Webhooks Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('listWebhooks', () => {
    it('should list all webhooks', async () => {
      const mockResponse = { webhooks: [{ id: '1', url: 'https://example.com' }] };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await listWebhooks(mockClient);

      expect(mockClient.get).toHaveBeenCalledWith('/hooks');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createWebhook', () => {
    it('should create a webhook', async () => {
      const params = {
        target_url: 'https://example.com/webhook',
        event_type: 'sms.mo'
      };
      const mockResponse = { id: '1', ...params };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await createWebhook(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/hooks', params);
      expect(result).toEqual(mockResponse);
    });

    it('should create webhook with request method', async () => {
      const params = {
        target_url: 'https://example.com/webhook',
        event_type: 'dlr',
        request_method: 'POST' as const
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await createWebhook(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/hooks', params);
    });
  });

  describe('deleteWebhook', () => {
    it('should delete webhook', async () => {
      const id = '123';
      const mockResponse = { success: true };
      mockClient.delete.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await deleteWebhook(mockClient, id);

      expect(mockClient.delete).toHaveBeenCalledWith(`/hooks?id=${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('webhooksTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(webhooksTools).toHaveLength(3);
      expect(webhooksTools.map(t => t.name)).toEqual([
        'list_webhooks',
        'create_webhook',
        'delete_webhook'
      ]);
    });
  });
});
