import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { sendVoice, hangupVoice, voiceTools } from '../../tools/voice.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('Voice Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('sendVoice', () => {
    it('should send voice call with required parameters', async () => {
      const params = { to: '+1234567890', text: 'Hello, this is a test call' };
      const mockResponse = { success: true, call_id: 'call-123' };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await sendVoice(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/voice', params);
      expect(result).toEqual(mockResponse);
    });

    it('should send voice call to multiple numbers', async () => {
      const params = {
        to: ['+1234567890', '+0987654321'],
        text: 'Bulk voice call',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendVoice(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/voice', params);
    });

    it('should send voice call with custom caller ID', async () => {
      const params = {
        to: '+1234567890',
        text: 'Test call',
        from: '+1111111111',
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendVoice(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/voice', params);
    });

    it('should send voice call with XML', async () => {
      const params = {
        to: '+1234567890',
        text: '<speak>Hello</speak>',
        xml: true,
      };
      mockClient.post.mockReturnValue(mockSuccessResponse({ success: true }));

      await sendVoice(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/voice', params);
    });
  });

  describe('hangupVoice', () => {
    it('should hangup active voice call', async () => {
      const callId = 'call-123';
      const mockResponse = { success: true };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await hangupVoice(mockClient, callId);

      expect(mockClient.post).toHaveBeenCalledWith(`/voice/${callId}/hangup`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('voiceTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(voiceTools).toHaveLength(2);
      expect(voiceTools[0].name).toBe('send_voice');
      expect(voiceTools[1].name).toBe('hangup_voice');
    });

    it('should have required fields in send_voice schema', () => {
      const sendVoiceTool = voiceTools.find(t => t.name === 'send_voice');
      expect(sendVoiceTool?.inputSchema.required).toContain('to');
      expect(sendVoiceTool?.inputSchema.required).toContain('text');
    });
  });
});
