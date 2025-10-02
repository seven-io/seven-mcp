import { SevenClient } from '../client.js';

export async function getStatus(client: SevenClient, params: { msg_id?: string; date?: string }) {
  return await client.get('/status', params);
}

export async function getLogbookSent(client: SevenClient, params?: { date_from?: string; date_to?: string; state?: string }) {
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
    description: 'Check delivery status of sent messages',
    inputSchema: {
      type: 'object',
      properties: {
        msg_id: {
          type: 'string',
          description: 'Message ID to check status',
        },
        date: {
          type: 'string',
          description: 'Date for status report (YYYY-MM-DD)',
        },
      },
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
