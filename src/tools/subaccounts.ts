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
          description: 'Full first and last name of the account owner',
        },
        email: {
          type: 'string',
          description: 'Email address of the account',
        },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'update_subaccount',
    description: 'Configure automatic balance transfer for a subaccount',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Subaccount ID',
        },
        threshold: {
          type: 'number',
          description: 'Credit threshold below which credit should be transferred (in EUR)',
        },
        amount: {
          type: 'number',
          description: 'Amount of credit to transfer from main account (in EUR)',
        },
      },
      required: ['id', 'threshold', 'amount'],
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
