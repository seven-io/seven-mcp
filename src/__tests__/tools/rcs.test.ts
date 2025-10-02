import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { sendRCS, deleteRCS, rcsEvents, rcsTools } from '../../tools/rcs.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('RCS Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('sendRCS', () => {
    it('should send RCS message with required parameters', async () => {
      const params = { to: '+1234567890', text: 'Hello RCS' };
      const mockResponse = { success: true, message_id: '123' };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await sendRCS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/rcs/messages', params);
      expect(result).toEqual(mockResponse);
    });

    it('should send RCS message with media', async () => {
      const params = {
        to: '+1234567890',
        text: 'Check this out',
        media: 'https://example.com/image.jpg',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendRCS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/rcs/messages', params);
    });

    it('should send RCS message with suggestions', async () => {
      const params = {
        to: '+1234567890',
        text: 'Choose an option',
        suggestions: [
          { text: 'Option 1', action: 'url://example.com' },
          { text: 'Option 2', action: 'url://example.com/2' },
        ],
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendRCS(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/rcs/messages', params);
    });
  });

  describe('deleteRCS', () => {
    it('should delete RCS message by ID', async () => {
      const messageId = 'msg-123';
      const mockResponse = { success: true };
      mockClient.delete.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await deleteRCS(mockClient, messageId);

      expect(mockClient.delete).toHaveBeenCalledWith(`/rcs/messages/${messageId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('rcsEvents', () => {
    it('should handle RCS events', async () => {
      const eventData = { type: 'delivered', message_id: '123' };
      const mockResponse = { success: true };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await rcsEvents(mockClient, eventData);

      expect(mockClient.post).toHaveBeenCalledWith('/rcs/events', eventData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('rcsTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(rcsTools).toHaveLength(3);
      expect(rcsTools[0].name).toBe('send_rcs');
      expect(rcsTools[1].name).toBe('delete_rcs');
      expect(rcsTools[2].name).toBe('rcs_events');
    });

    it('should have required fields in send_rcs schema', () => {
      const sendRCSTool = rcsTools.find(t => t.name === 'send_rcs');
      expect(sendRCSTool?.inputSchema.required).toContain('to');
    });
  });
});
