import { SevenClient } from '../client.js';

export async function validateSender(client: SevenClient, params: { sender: string; type: string }) {
  return await client.get('/validate_sender', params);
}

export const senderTools = [
  {
    name: 'validate_sender',
    description: 'Validate sender identifier for voice calls',
    inputSchema: {
      type: 'object',
      properties: {
        sender: {
          type: 'string',
          description: 'Sender identifier to validate',
        },
        type: {
          type: 'string',
          description: 'Type of validation (e.g., voice)',
          enum: ['voice', 'sms'],
        },
      },
      required: ['sender', 'type'],
    },
  },
];
