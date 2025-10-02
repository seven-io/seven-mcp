#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SevenClient } from './client.js';
import * as fs from 'fs';

// Import all tool definitions and handlers
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

const API_KEY = process.env.SEVEN_API_KEY;
const CLIENT_ID = 'seven-mcp';  // Static OAuth client ID
const LOG_FILE = process.env.SEVEN_LOG_FILE;

// API key is optional when OAuth is available
if (!API_KEY && !CLIENT_ID) {
  throw new Error('Authentication configuration error');
}

// Debug logging helper - only logs if SEVEN_LOG_FILE is set
function debugLog(message: string, data?: any) {
  if (LOG_FILE) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ': ' + JSON.stringify(data) : ''}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
  }
}

const client = new SevenClient({
  apiKey: API_KEY,
  clientId: CLIENT_ID
});

const server = new Server(
  {
    name: 'mcp-seven',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tools
const allTools = [
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

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;

    // Log incoming request
    debugLog(`Tool request: ${name}`, args);

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
        result = await rcsEvents(client, args.event_data);
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
      case 'update_number':
        result = await updateNumber(client, args.number as string, args.config);
        break;
      case 'delete_number':
        result = await deleteNumber(client, args.number as string);
        break;

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
      case 'update_contact':
        const { id: contactId, ...contactParams } = args;
        result = await updateContact(client, contactId as string, contactParams as any);
        break;
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
      case 'update_group':
        const { id: groupId, ...groupParams } = args;
        result = await updateGroup(client, groupId as string, groupParams as any);
        break;
      case 'delete_group':
        result = await deleteGroup(client, args.id as string);
        break;

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

    // Log response and return
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Seven.io MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});