import { SevenClient } from '../client.js';
import type { SMSParams } from '../types.js';

export async function sendSMS(client: SevenClient, params: SMSParams) {
  return await client.post('/sms', params);
}

export async function deleteSMS(client: SevenClient, ids: string | string[]) {
  // Convert ids to array format for query params
  const idsArray = Array.isArray(ids) ? ids : [ids];
  return await client.delete('/sms', { ids: idsArray });
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
        udh: {
          type: 'string',
          description: 'User Data Header for binary SMS',
        },
        is_binary: {
          type: 'boolean',
          description: 'Send as binary SMS',
        },
        files: {
          type: 'array',
          description: 'File attachments for SMS',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'File name',
              },
              contents: {
                type: 'string',
                description: 'Base64 encoded file content',
              },
              validity: {
                type: 'number',
                description: 'File deletion period in days',
              },
              password: {
                type: 'string',
                description: 'Password to access the file',
              },
            },
            required: ['name', 'contents'],
          },
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
