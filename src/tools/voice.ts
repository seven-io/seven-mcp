import { SevenClient } from '../client.js';
import type { VoiceParams } from '../types.js';

export async function sendVoice(client: SevenClient, params: VoiceParams) {
  return await client.post('/voice', params);
}

export async function hangupVoice(client: SevenClient, callId: string) {
  return await client.post(`/voice/${callId}/hangup`);
}

export const voiceTools = [
  {
    name: 'send_voice',
    description: 'Send a voice call with text-to-speech',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: ['string', 'array'],
          description: 'Recipient phone number(s)',
          items: { type: 'string' },
        },
        text: {
          type: 'string',
          description: 'Text to be converted to speech',
        },
        from: {
          type: 'string',
          description: 'Caller ID',
        },
        xml: {
          type: 'boolean',
          description: 'Use XML for advanced voice features',
        },
        debug: {
          type: 'boolean',
          description: 'Enable debug mode',
        },
      },
      required: ['to', 'text'],
    },
  },
  {
    name: 'hangup_voice',
    description: 'End an active voice call',
    inputSchema: {
      type: 'object',
      properties: {
        call_id: {
          type: 'string',
          description: 'Voice call ID to hangup',
        },
      },
      required: ['call_id'],
    },
  },
];
