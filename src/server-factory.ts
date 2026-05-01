import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import { SevenClient } from './client.js';

import { rcsTools, sendRCS, deleteRCS, rcsEvents } from './tools/rcs.js';
import { smsTools, sendSMS, deleteSMS } from './tools/sms.js';
import { voiceTools, sendVoice, hangupVoice } from './tools/voice.js';
import { accountTools, getBalance, getPricing, getAnalytics } from './tools/account.js';
import { lookupTools, lookupFormat, lookupRCS, lookupHLR, lookupMNP, lookupCNAM } from './tools/lookup.js';
import { statusTools, getStatus, getLogbookSent, getLogbookReceived, getLogbookVoice } from './tools/status.js';
import { numbersTools, getAvailableNumbers, orderNumber, getActiveNumbers, getNumber, updateNumber, deleteNumber } from './tools/numbers.js';
import { contactsTools, listContacts, createContact, getContact, updateContact, deleteContact } from './tools/contacts.js';
import { groupsTools, listGroups, createGroup, getGroup, updateGroup, deleteGroup } from './tools/groups.js';
import { subaccountsTools, listSubaccounts, createSubaccount, updateSubaccount, transferCredits, deleteSubaccount } from './tools/subaccounts.js';
import { webhooksTools, listWebhooks, createWebhook, deleteWebhook } from './tools/webhooks.js';
import { senderTools, validateSender } from './tools/sender.js';

export const allTools = [
  ...rcsTools,
  ...smsTools,
  ...voiceTools,
  ...accountTools,
  ...lookupTools,
  ...statusTools,
  ...numbersTools,
  ...contactsTools,
  ...groupsTools,
  ...subaccountsTools,
  ...webhooksTools,
  ...senderTools,
];

export type ClientResolver = () => SevenClient | Promise<SevenClient>;

export interface CreateServerOptions {
  resolveClient: ClientResolver;
  logFile?: string;
}

export function createMcpServer(options: CreateServerOptions): Server {
  const { resolveClient, logFile } = options;

  const debugLog = (message: string, data?: any) => {
    if (!logFile) return;
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ': ' + JSON.stringify(data) : ''}\n`;
    fs.appendFileSync(logFile, logEntry);
  };

  const server = new Server(
    { name: 'mcp-seven', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args = {} } = request.params;
      debugLog(`Tool request: ${name}`, args);

      const client = await resolveClient();
      let result: any;

      switch (name) {
        // RCS tools
        case 'send_rcs':
          result = await sendRCS(client, args as any);
          break;
        case 'delete_rcs':
          result = await deleteRCS(client, args.id as string);
          break;
        case 'rcs_events':
          result = await rcsEvents(client, args);
          break;

        // SMS tools
        case 'send_sms':
          result = await sendSMS(client, args as any);
          break;
        case 'delete_sms':
          result = await deleteSMS(client, args.ids as any);
          break;

        // Voice tools
        case 'send_voice':
          if (!args.to || !args.text) {
            throw new Error('send_voice requires "to" and "text" parameters');
          }
          result = await sendVoice(client, args as any);
          break;
        case 'hangup_voice':
          result = await hangupVoice(client, args.call_id as string);
          break;

        // Account tools
        case 'get_balance':
          result = await getBalance(client);
          break;
        case 'get_pricing':
          result = await getPricing(client, args as any);
          break;
        case 'get_analytics':
          result = await getAnalytics(client, args as any);
          break;

        // Lookup tools
        case 'lookup_format':
          result = await lookupFormat(client, args as any);
          break;
        case 'lookup_rcs':
          result = await lookupRCS(client, args as any);
          break;
        case 'lookup_hlr':
          result = await lookupHLR(client, args as any);
          break;
        case 'lookup_mnp':
          result = await lookupMNP(client, args as any);
          break;
        case 'lookup_cnam':
          result = await lookupCNAM(client, args as any);
          break;

        // Status & Logbook tools
        case 'get_status':
          result = await getStatus(client, args as any);
          break;
        case 'get_logbook_sent':
          result = await getLogbookSent(client, args as any);
          break;
        case 'get_logbook_received':
          result = await getLogbookReceived(client, args as any);
          break;
        case 'get_logbook_voice':
          result = await getLogbookVoice(client, args as any);
          break;

        // Numbers tools
        case 'get_available_numbers':
          result = await getAvailableNumbers(client, args as any);
          break;
        case 'order_number':
          result = await orderNumber(client, args as any);
          break;
        case 'get_active_numbers':
          result = await getActiveNumbers(client);
          break;
        case 'get_number':
          result = await getNumber(client, args.number as string);
          break;
        case 'update_number': {
          const { number: updateNum, ...updateConfig } = args;
          result = await updateNumber(client, updateNum as string, updateConfig as any);
          break;
        }
        case 'delete_number': {
          const { number: delNumber, delete_immediately } = args;
          result = await deleteNumber(client, delNumber as string, delete_immediately !== undefined ? { delete_immediately: delete_immediately as boolean } : undefined);
          break;
        }

        // Contacts tools
        case 'list_contacts':
          result = await listContacts(client);
          break;
        case 'create_contact':
          result = await createContact(client, args as any);
          break;
        case 'get_contact':
          result = await getContact(client, args.id as string);
          break;
        case 'update_contact': {
          const { id: contactId, ...contactParams } = args;
          result = await updateContact(client, contactId as string, contactParams as any);
          break;
        }
        case 'delete_contact':
          result = await deleteContact(client, args.id as string);
          break;

        // Groups tools
        case 'list_groups':
          result = await listGroups(client);
          break;
        case 'create_group':
          result = await createGroup(client, args as any);
          break;
        case 'get_group':
          result = await getGroup(client, args.id as string);
          break;
        case 'update_group': {
          const { id: groupId, ...groupParams } = args;
          result = await updateGroup(client, groupId as string, groupParams as any);
          break;
        }
        case 'delete_group': {
          const { id: delGroupId, delete_contacts } = args;
          result = await deleteGroup(client, delGroupId as string, delete_contacts !== undefined ? { delete_contacts: delete_contacts as boolean } : undefined);
          break;
        }

        // Subaccounts tools
        case 'list_subaccounts':
          result = await listSubaccounts(client);
          break;
        case 'create_subaccount':
          result = await createSubaccount(client, args as any);
          break;
        case 'update_subaccount':
          result = await updateSubaccount(client, args as any);
          break;
        case 'transfer_credits':
          result = await transferCredits(client, args as any);
          break;
        case 'delete_subaccount':
          result = await deleteSubaccount(client, args.id as string);
          break;

        // Webhooks tools
        case 'list_webhooks':
          result = await listWebhooks(client);
          break;
        case 'create_webhook':
          result = await createWebhook(client, args as any);
          break;
        case 'delete_webhook':
          result = await deleteWebhook(client, args.id as string);
          break;

        // Sender tools
        case 'validate_sender':
          result = await validateSender(client, args as any);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      debugLog(`Tool response: ${name}`, result);
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    } catch (error: any) {
      debugLog(`Tool error: ${request.params.name}`, { error: error.message });
      return {
        content: [{ type: 'text', text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });

  return server;
}
