import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { sendSMS, deleteSMS, smsTools } from '../../tools/sms.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('SMS Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('sendSMS', () => {
    it('should send SMS with required parameters', async () => {
      const params = { to: '+1234567890', text: 'Hello SMS' };
      const mockResponse = { success: true, message_id: '123' };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await sendSMS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/sms', params);
      expect(result).toEqual(mockResponse);
    });

    it('should send SMS to multiple recipients', async () => {
      const params = {
        to: ['+1234567890', '+0987654321'],
        text: 'Bulk SMS',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendSMS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/sms', params);
    });

    it('should send SMS with custom sender', async () => {
      const params = {
        to: '+1234567890',
        text: 'Hello',
        from: 'MyCompany',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendSMS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/sms', params);
    });

    it('should send delayed SMS', async () => {
      const params = {
        to: '+1234567890',
        text: 'Delayed message',
        delay: '2024-12-31T23:59:59Z',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendSMS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/sms', params);
    });

    it('should send flash SMS', async () => {
      const params = {
        to: '+1234567890',
        text: 'Flash message',
        flash: true,
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendSMS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/sms', params);
    });
  });

  describe('deleteSMS', () => {
    it('should delete single SMS by ID', async () => {
      const messageId = 'msg-123';
      const mockResponse = { success: true };
      mockClient.delete.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await deleteSMS(mockClient, messageId);

      expect(mockClient.delete).toHaveBeenCalledWith(`/sms?ids=${messageId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should delete multiple SMS by IDs', async () => {
      const messageIds = ['msg-123', 'msg-456'];
      const mockResponse = { success: true };
      mockClient.delete.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await deleteSMS(mockClient, messageIds);

      expect(mockClient.delete).toHaveBeenCalledWith('/sms?ids=msg-123,msg-456');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('smsTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(smsTools).toHaveLength(2);
      expect(smsTools[0].name).toBe('send_sms');
      expect(smsTools[1].name).toBe('delete_sms');
    });

    it('should have required fields in send_sms schema', () => {
      const sendSMSTool = smsTools.find(t => t.name === 'send_sms');
      expect(sendSMSTool?.inputSchema.required).toContain('to');
      expect(sendSMSTool?.inputSchema.required).toContain('text');
    });
  });
});
