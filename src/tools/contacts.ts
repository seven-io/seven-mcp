import { SevenClient } from '../client.js';
import type { ContactParams } from '../types.js';

export async function listContacts(client: SevenClient) {
  return await client.get('/contacts');
}

export async function createContact(client: SevenClient, params: ContactParams) {
  return await client.post('/contacts', params, { formEncoded: true });
}

export async function getContact(client: SevenClient, id: string) {
  return await client.get(`/contacts/${id}`);
}

export async function updateContact(client: SevenClient, id: string, params: ContactParams) {
  return await client.patch(`/contacts/${id}`, params, { formEncoded: true });
}

export async function deleteContact(client: SevenClient, id: string) {
  return await client.delete(`/contacts/${id}`);
}

export const contactsTools = [
  {
    name: 'list_contacts',
    description: 'List all contacts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_contact',
    description: 'Create a new contact',
    inputSchema: {
      type: 'object',
      properties: {
        firstname: {
          type: 'string',
          description: 'First name',
        },
        lastname: {
          type: 'string',
          description: 'Last name',
        },
        mobile_number: {
          type: 'string',
          description: 'Mobile phone number',
        },
        home_number: {
          type: 'string',
          description: 'Home phone number',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        address: {
          type: 'string',
          description: 'Street address',
        },
        postal_code: {
          type: 'string',
          description: 'Postal/ZIP code',
        },
        city: {
          type: 'string',
          description: 'City',
        },
        birthday: {
          type: 'string',
          description: 'Birthday',
        },
        notes: {
          type: 'string',
          description: 'Notes',
        },
        avatar: {
          type: 'string',
          description: 'Avatar image URL',
        },
        groups: {
          type: 'array',
          description: 'Array of group IDs to add the contact to',
          items: { type: 'string' },
        },
      },
    },
  },
  {
    name: 'get_contact',
    description: 'Get a specific contact by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Contact ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_contact',
    description: 'Update a contact. To add/remove contact from groups, provide the complete list of group IDs the contact should be a member of.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Contact ID to update',
        },
        firstname: {
          type: 'string',
          description: 'First name',
        },
        lastname: {
          type: 'string',
          description: 'Last name',
        },
        mobile_number: {
          type: 'string',
          description: 'Mobile phone number',
        },
        home_number: {
          type: 'string',
          description: 'Home phone number',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        address: {
          type: 'string',
          description: 'Street address',
        },
        postal_code: {
          type: 'string',
          description: 'Postal/ZIP code',
        },
        city: {
          type: 'string',
          description: 'City',
        },
        birthday: {
          type: 'string',
          description: 'Birthday',
        },
        notes: {
          type: 'string',
          description: 'Notes',
        },
        avatar: {
          type: 'string',
          description: 'Avatar image URL',
        },
        groups: {
          type: 'array',
          description: 'Complete array of group IDs the contact should be a member of (replaces existing groups)',
          items: { type: 'string' },
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_contact',
    description: 'Delete a contact',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Contact ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
