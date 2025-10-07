import { SevenClient } from '../client.js';

export async function getBalance(client: SevenClient) {
  return await client.get('/balance');
}

export async function getPricing(client: SevenClient, params?: { country?: string; format?: string }) {
  return await client.get('/pricing', params);
}

export async function getAnalytics(client: SevenClient, params?: { start?: string; end?: string; subaccounts?: string | number; group_by?: string; label?: string }) {
  return await client.get('/analytics', params);
}

export const accountTools = [
  {
    name: 'get_balance',
    description: 'Check account balance',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_pricing',
    description: 'Get pricing information for SMS, voice, and other services',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'Country code (ISO 3166-1 alpha-2) to get specific pricing',
        },
        format: {
          type: 'string',
          description: 'Response format',
          enum: ['json', 'csv'],
        },
      },
    },
  },
  {
    name: 'get_analytics',
    description: 'Get account statistics and analytics',
    inputSchema: {
      type: 'object',
      properties: {
        start: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        end: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
        subaccounts: {
          type: ['string', 'number'],
          description: 'Subaccount filter: "only_main" for main account only, "all" for all accounts, or specific subaccount ID (integer)',
        },
        group_by: {
          type: 'string',
          description: 'Group analytics by (country, date, label, subaccount)',
          enum: ['country', 'date', 'label', 'subaccount'],
        },
        label: {
          type: 'string',
          description: 'Filter by label',
        },
      },
    },
  },
];
