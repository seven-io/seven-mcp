import { SevenClient } from '../client.js';
import type { LookupParams } from '../types.js';

export async function lookupFormat(client: SevenClient, params: LookupParams) {
  return await client.get('/lookup/format', { number: params.number });
}

export async function lookupRCS(client: SevenClient, params: LookupParams) {
  return await client.get('/lookup/rcs', { number: params.number });
}

export async function lookupHLR(client: SevenClient, params: LookupParams) {
  return await client.get('/lookup/hlr', { number: params.number });
}

export async function lookupMNP(client: SevenClient, params: LookupParams) {
  return await client.get('/lookup/mnp', { number: params.number });
}

export async function lookupCNAM(client: SevenClient, params: LookupParams) {
  return await client.get('/lookup/cnam', { number: params.number });
}

export const lookupTools = [
  {
    name: 'lookup_format',
    description: 'Validate phone number format',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to validate',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'lookup_rcs',
    description: 'Check RCS capabilities for a phone number',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number to check RCS capabilities',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'lookup_hlr',
    description: 'Perform Home Location Register lookup (network info, roaming status)',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number for HLR lookup',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'lookup_mnp',
    description: 'Perform Mobile Number Portability lookup (carrier information)',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number for MNP lookup',
        },
      },
      required: ['number'],
    },
  },
  {
    name: 'lookup_cnam',
    description: 'Perform Caller ID name lookup',
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Phone number for CNAM lookup',
        },
      },
      required: ['number'],
    },
  },
];
