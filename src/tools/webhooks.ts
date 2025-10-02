import { SevenClient } from '../client.js';
import type { WebhookParams } from '../types.js';

export async function listWebhooks(client: SevenClient) {
  return await client.get('/hooks');
}

export async function createWebhook(client: SevenClient, params: WebhookParams) {
  return await client.post('/hooks', params);
}

export async function deleteWebhook(client: SevenClient, id: string) {
  return await client.delete(`/hooks?id=${id}`);
}

export const webhooksTools = [
  {
    name: 'list_webhooks',
    description: 'List all registered webhooks',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_webhook',
    description: 'Register a new webhook',
    inputSchema: {
      type: 'object',
      properties: {
        target_url: {
          type: 'string',
          description: 'Webhook URL to receive events',
        },
        event_type: {
          type: 'string',
          description: 'Event type to trigger webhook (e.g., sms.mo, dlr)',
          enum: ['sms.mo', 'dlr', 'voice.status', 'all'],
        },
        request_method: {
          type: 'string',
          description: 'HTTP method for webhook requests',
          enum: ['GET', 'POST'],
        },
      },
      required: ['target_url', 'event_type'],
    },
  },
  {
    name: 'delete_webhook',
    description: 'Delete a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Webhook ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
