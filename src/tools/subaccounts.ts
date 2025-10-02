import { SevenClient } from '../client.js';
import type { SubaccountParams } from '../types.js';

export async function listSubaccounts(client: SevenClient) {
  return await client.get('/subaccounts?action=read');
}

export async function createSubaccount(client: SevenClient, params: SubaccountParams) {
  return await client.post('/subaccounts?action=create', params);
}

export async function updateSubaccount(client: SevenClient, params: SubaccountParams & { id: string }) {
  return await client.post('/subaccounts?action=update', params);
}

export async function transferCredits(client: SevenClient, params: { id: string; amount: number }) {
  return await client.post('/subaccounts?action=transfer_credits', params);
}

export async function deleteSubaccount(client: SevenClient, id: string) {
  return await client.post('/subaccounts?action=delete', { id });
}

export const subaccountsTools = [
  {
    name: 'list_subaccounts',
    description: 'List all subaccounts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_subaccount',
    description: 'Create a new subaccount',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Subaccount name',
        },
        email: {
          type: 'string',
          description: 'Subaccount email',
        },
        auto_recharge: {
          type: 'boolean',
          description: 'Enable automatic credit transfer',
        },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'update_subaccount',
    description: 'Update subaccount auto credit transfer settings',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Subaccount ID',
        },
        auto_recharge: {
          type: 'boolean',
          description: 'Enable/disable automatic credit transfer',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'transfer_credits',
    description: 'Manually transfer credits to a subaccount',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Subaccount ID',
        },
        amount: {
          type: 'number',
          description: 'Amount of credits to transfer',
        },
      },
      required: ['id', 'amount'],
    },
  },
  {
    name: 'delete_subaccount',
    description: 'Delete a subaccount',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Subaccount ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
