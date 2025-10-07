import { SevenClient } from '../client.js';
import type { RCSParams } from '../types.js';

export async function sendRCS(client: SevenClient, params: RCSParams) {
  return await client.post('/rcs/messages', params);
}

export async function deleteRCS(client: SevenClient, id: string) {
  return await client.delete(`/rcs/messages/${id}`);
}

export async function rcsEvents(client: SevenClient, params: any) {
  // Transform property names based on event type
  const payload = { ...params };

  // Rename event_type to event (correct API parameter name)
  if (payload.event_type) {
    payload.event = payload.event_type;
    delete payload.event_type;
  }

  // For IS_TYPING events, use 'to' property instead of 'phone'
  if (payload.phone && payload.event === 'IS_TYPING') {
    payload.to = payload.phone;
    delete payload.phone;
  }

  // For READ events, use 'msg_id' instead of 'message_id'
  if (payload.message_id && payload.event === 'READ') {
    payload.msg_id = payload.message_id;
    delete payload.message_id;
  }

  return await client.post('/rcs/events', payload);
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
        delay: {
          type: 'string',
          description: 'Delayed sending timestamp (Unix timestamp or ISO 8601)',
        },
        ttl: {
          type: 'number',
          description: 'Time to live in minutes',
        },
        label: {
          type: 'string',
          description: 'Custom label for the message',
        },
        performance_tracking: {
          type: 'boolean',
          description: 'Enable performance tracking',
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
    description: 'Handle RCS events (delivery reports, read receipts, IS_TYPING, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        event_type: {
          type: 'string',
          description: 'Event type (IS_TYPING, READ, DELIVERED, etc.)',
          enum: ['IS_TYPING', 'READ', 'DELIVERED'],
        },
        phone: {
          type: 'string',
          description: 'Phone number (for IS_TYPING events)',
        },
        to: {
          type: 'string',
          description: 'Recipient phone number',
        },
        message_id: {
          type: 'string',
          description: 'Message ID (for READ events)',
        },
        msg_id: {
          type: 'string',
          description: 'Message ID (alternative)',
        },
      },
      required: ['event_type'],
    },
  },
];
