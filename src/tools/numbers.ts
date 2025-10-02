import { SevenClient } from '../client.js';
import type { NumberParams } from '../types.js';

export async function getAvailableNumbers(client: SevenClient, params?: NumberParams) {
  return await client.get('/numbers/available', params);
}

export async function orderNumber(client: SevenClient, params: { number: string }) {
  return await client.post('/numbers/order', params);
}

export async function getActiveNumbers(client: SevenClient) {
  return await client.get('/numbers/active');
}

export async function getNumber(client: SevenClient, number: string) {
  return await client.get(`/numbers/active/${number}`);
}

export async function updateNumber(client: SevenClient, number: string, params: any) {
  return await client.patch(`/numbers/active/${number}`, params);
}

export async function deleteNumber(client: SevenClient, number: string) {
  return await client.delete(`/numbers/active/${number}`);
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
    description: 'Update phone number configuration',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to update',
        },
        config: {
          type: 'object',
          description: 'Configuration to update (forwarding, webhooks, etc.)',
        },
      },
      required: ['number', 'config'],
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
      },
      required: ['number'],
    },
  },
];
