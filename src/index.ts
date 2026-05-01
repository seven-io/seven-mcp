#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SevenClient } from './client.js';
import { createMcpServer } from './server-factory.js';

const API_KEY = process.env.SEVEN_API_KEY;
const CLIENT_ID = 'seven-mcp';
const LOG_FILE = process.env.SEVEN_LOG_FILE;

const client = new SevenClient({
  apiKey: API_KEY,
  clientId: CLIENT_ID,
});

const server = createMcpServer({
  resolveClient: () => client,
  logFile: LOG_FILE,
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export default main;

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
