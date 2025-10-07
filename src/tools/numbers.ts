import { SevenClient } from '../client.js';
import type { NumberParams } from '../types.js';

export async function getAvailableNumbers(client: SevenClient, params?: NumberParams) {
  return await client.get('/numbers/available', params);
}

export async function orderNumber(client: SevenClient, params: { number: string; payment_interval?: 'monthly' | 'annually' }) {
  return await client.post('/numbers/order', params);
}

export async function getActiveNumbers(client: SevenClient) {
  return await client.get('/numbers/active');
}

export async function getNumber(client: SevenClient, number: string) {
  return await client.get(`/numbers/active/${number}`);
}

export async function updateNumber(client: SevenClient, number: string, params: { friendly_name?: string; sms_forward?: string[]; email_forward?: string[]; slack_forward?: string }) {
  return await client.patch(`/numbers/active/${number}`, params);
}

export async function deleteNumber(client: SevenClient, number: string, params?: { delete_immediately?: boolean }) {
  return await client.delete(`/numbers/active/${number}`, params);
}

export const numbersTools = [
  {
    name: 'get_available_numbers',
    description: 'List available phone numbers for purchase',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'Country code to filter available numbers',
        },
        type: {
          type: 'string',
          description: 'Number type (e.g., mobile, landline)',
        },
        features_sms: {
          type: 'boolean',
          description: 'Filter numbers supporting SMS',
        },
        features_a2p_sms: {
          type: 'boolean',
          description: 'Filter numbers supporting A2P SMS',
        },
        features_voice: {
          type: 'boolean',
          description: 'Filter numbers supporting voice calls',
        },
      },
    },
  },
  {
    name: 'order_number',
    description: 'Purchase a phone number',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to purchase',
        },
        payment_interval: {
          type: 'string',
          enum: ['monthly', 'annually'],
          description: 'Payment interval for the number (default: annually)',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'get_active_numbers',
    description: 'List all active phone numbers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_number',
    description: 'Get details of a specific active phone number',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to retrieve',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'update_number',
    description: 'Update phone number configuration including friendly name and forwarding settings',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to update',
        },
        friendly_name: {
          type: 'string',
          description: 'Custom friendly name for the number',
        },
        sms_forward: {
          type: 'array',
          description: 'Phone numbers to forward incoming SMS to',
          items: { type: 'string' },
        },
        email_forward: {
          type: 'array',
          description: 'Email addresses to forward incoming SMS to',
          items: { type: 'string' },
        },
        slack_forward: {
          type: 'string',
          description: 'Slack webhook URL to forward incoming SMS to',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'delete_number',
    description: 'Cancel/delete a phone number',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to delete',
        },
        delete_immediately: {
          type: 'boolean',
          description: 'Delete immediately instead of at end of billing period',
        },
      },
      required: ['number'],
    },
  },
];
