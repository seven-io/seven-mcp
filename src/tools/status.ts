import { SevenClient } from '../client.js';

export async function getStatus(client: SevenClient, params: { id: string }) {
  return await client.get('/journal/outbound', { id: params.id });
}

export async function getLogbookSent(client: SevenClient, params?: { date_from?: string; date_to?: string; state?: string; limit?: number }) {
  return await client.get('/journal/outbound', params);
}

export async function getLogbookReceived(client: SevenClient, params?: { date_from?: string; date_to?: string }) {
  return await client.get('/journal/inbound', params);
}

export async function getLogbookVoice(client: SevenClient, params?: { date_from?: string; date_to?: string }) {
  return await client.get('/journal/voice', params);
}

export const statusTools = [
  {
    name: 'get_status',
    description: 'Get detailed information about a sent message using its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Message ID to retrieve details',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_logbook_sent',
    description: 'View sent messages in logbook',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
        state: {
          type: 'string',
          description: 'Filter by message state',
          enum: ['pending', 'delivered', 'failed'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of entries to return',
        },
      },
    },
  },
  {
    name: 'get_logbook_received',
    description: 'View received SMS messages',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
    },
  },
  {
    name: 'get_logbook_voice',
    description: 'View voice call history',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
    },
  },
];
