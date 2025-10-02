import { SevenClient } from '../client.js';
import type { RCSParams } from '../types.js';

export async function sendRCS(client: SevenClient, params: RCSParams) {
  return await client.post('/rcs/messages', params);
}

export async function deleteRCS(client: SevenClient, id: string) {
  return await client.delete(`/rcs/messages/${id}`);
}

export async function rcsEvents(client: SevenClient, params: any) {
  return await client.post('/rcs/events', params);
}

export const rcsTools = [
  {
    name: 'send_rcs',
    description: 'Send an RCS (Rich Communication Services) message',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number',
        },
        text: {
          type: 'string',
          description: 'Message text content',
        },
        media: {
          type: 'string',
          description: 'URL to media file (image, video, etc.)',
        },
        suggestions: {
          type: 'array',
          description: 'Quick reply suggestions',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              action: { type: 'string' },
            },
          },
        },
        orientation: {
          type: 'string',
          description: 'Media orientation',
          enum: ['horizontal', 'vertical'],
        },
        from: {
          type: 'string',
          description: 'Sender identifier',
        },
        foreign_id: {
          type: 'string',
          description: 'Custom ID for tracking',
        },
      },
      required: ['to'],
    },
  },
  {
    name: 'delete_rcs',
    description: 'Delete a scheduled RCS message',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'RCS message ID to delete',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'rcs_events',
    description: 'Handle RCS events (delivery reports, read receipts, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        event_data: {
          type: 'object',
          description: 'Event data payload',
        },
      },
      required: ['event_data'],
    },
  },
];
