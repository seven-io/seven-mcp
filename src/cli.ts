#!/usr/bin/env node
import { performOAuthFlow } from './oauth/flow.js';
import { getTokens, deleteTokens, hasTokens } from './oauth/tokens.js';

const CLIENT_ID = 'seven-mcp';  // Static OAuth client ID

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'login':
      await handleLogin();
      break;

    case 'logout':
      await handleLogout();
      break;

    case 'status':
      await handleStatus();
      break;

    default:
      showHelp();
      process.exit(1);
  }
}

async function handleLogin() {
  try {
    // Check if already logged in
    if (await hasTokens()) {
      console.log('You are already logged in.');
      console.log('Run "seven-mcp logout" first if you want to log in again.');
      process.exit(0);
    }

    // Perform OAuth flow
    await performOAuthFlow({
      clientId: CLIENT_ID,
      scope: 'analytics balance contacts groups hooks journal lookup numbers pricing rcs sms status subaccounts validate_for_voice voice',
    });

    console.log('\n✓ Login successful!');
    console.log('You can now use the seven.io MCP server with OAuth authentication.');
  } catch (error: any) {
    console.error('\n✗ Login failed:', error.message);
    process.exit(1);
  }
}

async function handleLogout() {
  try {
    if (!(await hasTokens())) {
      console.log('You are not logged in.');
      process.exit(0);
    }

    const deleted = await deleteTokens();
    if (deleted) {
      console.log('✓ Logout successful. Tokens have been removed.');
    } else {
      console.log('No tokens found to remove.');
    }
  } catch (error: any) {
    console.error('✗ Logout failed:', error.message);
    process.exit(1);
  }
}

async function handleStatus() {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      console.log('Status: Not logged in');
      console.log('\nRun "seven-mcp login" to authenticate.');
      process.exit(0);
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = tokens.expires_at - now;

    console.log('Status: Logged in');

    // Try to get account info from keychain
    try {
      const keytar = await import('keytar');
      const k = keytar.default || keytar;
      const account = await k.getPassword('seven-mcp', 'current-account');
      if (account) {
        console.log(`Account: ${account}`);
      }
    } catch {}

    console.log(`Token type: ${tokens.token_type}`);
    console.log(`Scope: ${tokens.scope || 'N/A'}`);

    if (expiresIn > 0) {
      const minutes = Math.floor(expiresIn / 60);
      const seconds = expiresIn % 60;
      console.log(`Expires in: ${minutes}m ${seconds}s`);
    } else {
      console.log('Token: EXPIRED (will be auto-refreshed on next use)');
    }
  } catch (error: any) {
    console.error('✗ Failed to check status:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
seven-mcp - Seven.io MCP Server CLI

USAGE:
  seven-mcp <command>

COMMANDS:
  login     Authenticate with seven.io using OAuth
  logout    Remove stored authentication tokens
  status    Show current authentication status
  help      Show this help message

EXAMPLES:
  # Login with OAuth
  seven-mcp login

  # Check authentication status
  seven-mcp status

  # Logout
  seven-mcp logout

For more information, visit https://github.com/yourusername/mcp-seven
  `);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
