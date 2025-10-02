import { SevenClient } from '../client.js';
import type { GroupParams } from '../types.js';

export async function listGroups(client: SevenClient) {
  return await client.get('/groups');
}

export async function createGroup(client: SevenClient, params: GroupParams) {
  return await client.post('/groups', params, { formEncoded: true });
}

export async function getGroup(client: SevenClient, id: string) {
  return await client.get(`/groups/${id}`);
}

export async function updateGroup(client: SevenClient, id: string, params: GroupParams) {
  return await client.patch(`/groups/${id}`, params, { formEncoded: true });
}

export async function deleteGroup(client: SevenClient, id: string) {
  return await client.delete(`/groups/${id}`);
}

export const groupsTools = [
  {
    name: 'list_groups',
    description: 'List all contact groups',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_group',
    description: 'Create a new contact group',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Group name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_group',
    description: 'Get a specific group by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Group ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_group',
    description: 'Update a contact group (only name can be updated)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Group ID to update',
        },
        name: {
          type: 'string',
          description: 'Group name',
        },
      },
      required: ['id', 'name'],
    },
  },
  {
    name: 'delete_group',
    description: 'Delete a contact group',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Group ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
