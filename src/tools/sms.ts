import { SevenClient } from '../client.js';
import type { SMSParams } from '../types.js';

export async function sendSMS(client: SevenClient, params: SMSParams) {
  return await client.post('/sms', params);
}

export async function deleteSMS(client: SevenClient, ids: string | string[]) {
  return await client.delete(`/sms?ids=${Array.isArray(ids) ? ids.join(',') : ids}`);
}

export const smsTools = [
  {
    name: 'send_sms',
    description: 'Send an SMS message to one or multiple recipients',
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
          description: 'SMS message text',
        },
        from: {
          type: 'string',
          description: 'Sender ID (alphanumeric or phone number)',
        },
        delay: {
          type: 'string',
          description: 'Delayed sending timestamp (Unix timestamp or ISO 8601)',
        },
        debug: {
          type: 'boolean',
          description: 'Enable debug mode (no actual sending)',
        },
        flash: {
          type: 'boolean',
          description: 'Send as flash SMS',
        },
        no_reload: {
          type: 'boolean',
          description: 'Disable automatic reloading of phone numbers',
        },
        unicode: {
          type: 'boolean',
          description: 'Enable unicode mode',
        },
        utf8: {
          type: 'boolean',
          description: 'Enable UTF-8 encoding',
        },
        details: {
          type: 'boolean',
          description: 'Return detailed response',
        },
        return_msg_id: {
          type: 'boolean',
          description: 'Return message ID',
        },
        performance_tracking: {
          type: 'boolean',
          description: 'Enable performance tracking',
        },
        label: {
          type: 'string',
          description: 'Custom label for the message',
        },
        foreign_id: {
          type: 'string',
          description: 'Custom ID for tracking',
        },
        ttl: {
          type: 'number',
          description: 'Time to live in minutes',
        },
      },
      required: ['to', 'text'],
    },
  },
  {
    name: 'delete_sms',
    description: 'Delete scheduled SMS message(s)',
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: ['string', 'array'],
          description: 'SMS message ID(s) to delete',
          items: { type: 'string' },
        },
      },
      required: ['ids'],
    },
  },
];
