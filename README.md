# MCP Seven

Model Context Protocol (MCP) server for the [seven.io](https://www.seven.io) API. This server provides comprehensive access to seven.io's SMS, voice, RCS messaging, and account management services.

## Features

### Messaging
- **SMS**: Send and manage SMS messages
- **RCS**: Send Rich Communication Services messages with media and suggestions
- **Voice**: Send text-to-speech voice calls

### Account Management
- **Balance**: Check account balance
- **Pricing**: Get pricing information by country
- **Analytics**: View account statistics

### Lookup Services
- **Format Validation**: Validate phone number formats
- **HLR**: Home Location Register lookups (network info, roaming status)
- **MNP**: Mobile Number Portability lookups (carrier information)
- **CNAM**: Caller ID name lookups
- **RCS Capabilities**: Check if a number supports RCS

### Contact Management
- **Contacts**: Full CRUD operations for contacts
- **Groups**: Manage contact groups

### Phone Numbers
- Browse, purchase, and manage phone numbers

### Advanced Features
- **Webhooks**: Register webhooks for events
- **Subaccounts**: Create and manage subaccounts
- **Status & Logbook**: Track message delivery and view history

## Installation

```bash
npm install -g @seven.io/mcp
```

## Authentication

This MCP server supports two authentication methods:

### Option 1: OAuth 2.0 with PKCE (Recommended)

OAuth provides better security with automatic token refresh and fine-grained scopes.

1. **Login via CLI**:
```bash
npx @seven.io/mcp login
```

This will:
- Open your browser to seven.io OAuth authorization
- Request necessary permissions (SMS, Voice, RCS, etc.)
- Store tokens securely in your system keychain
- Auto-refresh tokens when they expire

**CLI Commands**:
```bash
# Login with OAuth
npx @seven.io/mcp login

# Check authentication status
npx @seven.io/mcp status

# Logout (remove stored tokens)
npx @seven.io/mcp logout
```

### Option 2: API Key (Legacy)

For backwards compatibility, you can still use an API key:

```bash
export SEVEN_API_KEY="your-api-key"
```

Get your API key from the [seven.io dashboard](https://app.seven.io).

### Priority

If both authentication methods are configured, OAuth takes priority.

## Usage with Claude Desktop

Add this to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**With OAuth (recommended)**:
```json
{
  "mcpServers": {
    "seven": {
      "command": "npx",
      "args": ["@seven.io/mcp"]
    }
  }
}
```

**With API Key**:
```json
{
  "mcpServers": {
    "seven": {
      "command": "npx",
      "args": ["@seven.io/mcp"],
      "env": {
        "SEVEN_API_KEY": "your-api-key"
      }
    }
  }
}
```

**With Debug Logging**:
To enable request/response logging for debugging, add the `SEVEN_LOG_FILE` environment variable:
```json
{
  "mcpServers": {
    "seven": {
      "command": "npx",
      "args": ["@seven.io/mcp"],
      "env": {
        "SEVEN_API_KEY": "your-api-key",
        "SEVEN_LOG_FILE": "/tmp/mcp-seven-debug.log"
      }
    }
  }
}
```

Then monitor the log file:
```bash
tail -f /tmp/mcp-seven-debug.log
```

**Note**: If using OAuth, run `npx @seven.io/mcp login` before starting Claude Desktop.

## Available Tools

### Messaging Tools
- `send_sms` - Send SMS messages
- `delete_sms` - Delete scheduled SMS
- `send_rcs` - Send RCS messages
- `delete_rcs` - Delete RCS messages
- `rcs_events` - Handle RCS events
- `send_voice` - Send voice calls
- `hangup_voice` - End active voice calls

### Account Tools
- `get_balance` - Check account balance
- `get_pricing` - Get pricing information
- `get_analytics` - View account statistics

### Lookup Tools
- `lookup_format` - Validate phone number format
- `lookup_hlr` - Home Location Register lookup
- `lookup_mnp` - Mobile Number Portability lookup
- `lookup_cnam` - Caller ID name lookup
- `lookup_rcs` - Check RCS capabilities

### Status & Logbook Tools
- `get_status` - Check message delivery status
- `get_logbook_sent` - View sent messages
- `get_logbook_received` - View received SMS
- `get_logbook_voice` - View voice call history

### Phone Numbers Tools
- `get_available_numbers` - List available numbers
- `order_number` - Purchase a phone number
- `get_active_numbers` - List active numbers
- `get_number` - Get number details
- `update_number` - Update number configuration
- `delete_number` - Cancel/delete number

### Contact Tools
- `list_contacts` - List all contacts
- `create_contact` - Create new contact
- `get_contact` - Get contact by ID
- `update_contact` - Update contact
- `delete_contact` - Delete contact

### Group Tools
- `list_groups` - List all groups
- `create_group` - Create new group
- `get_group` - Get group by ID
- `update_group` - Update group
- `delete_group` - Delete group

### Subaccount Tools
- `list_subaccounts` - List all subaccounts
- `create_subaccount` - Create new subaccount
- `update_subaccount` - Update subaccount settings
- `transfer_credits` - Transfer credits to subaccount
- `delete_subaccount` - Delete subaccount

### Webhook Tools
- `list_webhooks` - List registered webhooks
- `create_webhook` - Register new webhook
- `delete_webhook` - Delete webhook

### Sender Tools
- `validate_sender` - Validate sender identifiers

## Example Usage

Once configured, you can use the tools in Claude:

```
Send an SMS to +1234567890 saying "Hello from seven.io!"
```

```
Check my account balance
```

```
Look up the carrier information for phone number +1234567890
```

## Development

### Watch mode
```bash
npm run watch
```

### Build
```bash
npm run build
```

### Testing

Run the comprehensive test suite:

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

#### Test Coverage

The test suite includes:
- **Unit tests** for all API client methods
- **Tool tests** for all 40+ MCP tools covering:
  - RCS messaging (3 tools)
  - SMS messaging (2 tools)
  - Voice calls (2 tools)
  - Account management (3 tools)
  - Lookup services (5 tools)
  - Status & Logbook (4 tools)
  - Phone number management (6 tools)
  - Contact management (5 tools)
  - Group management (5 tools)
  - Subaccount management (5 tools)
  - Webhook management (3 tools)
  - Sender validation (1 tool)
- **Integration tests** verifying all tools export correctly and have valid schemas
- **Endpoint validation tests** that verify API endpoint paths are correct (requires SEVEN_API_KEY)

Coverage target: 80% for branches, functions, lines, and statements.

#### Endpoint Validation

To run endpoint validation tests that verify the API paths are correct:

```bash
SEVEN_API_KEY=your-api-key npm test
```

These integration tests ensure that endpoints match the seven.io API documentation and will catch issues like incorrect paths (e.g., using `/logbook/received` instead of `/journal/inbound`).

## API Documentation

For detailed API documentation, visit [docs.seven.io](https://docs.seven.io).

## License

MIT
