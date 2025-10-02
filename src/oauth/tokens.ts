const SERVICE_NAME = 'seven-mcp';
const DEFAULT_ACCOUNT_NAME = 'oauth-tokens';
const CURRENT_ACCOUNT_KEY = 'current-account';

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
  token_type: string;
  scope?: string;
}

/**
 * Get keytar module dynamically
 */
async function getKeytar() {
  try {
    const keytar = await import('keytar');
    return keytar.default || keytar;
  } catch (error) {
    throw new Error('Keytar module not available. Please ensure it is properly installed.');
  }
}

/**
 * Store OAuth tokens securely in system keychain
 * @param tokens - OAuth tokens to store
 * @param account - Optional account identifier (email or user_id)
 */
export async function storeTokens(tokens: OAuthTokens, account?: string): Promise<void> {
  const keytar = await getKeytar();
  const accountName = account || DEFAULT_ACCOUNT_NAME;
  const tokenData = JSON.stringify(tokens);

  // Store the tokens
  await keytar.setPassword(SERVICE_NAME, accountName, tokenData);

  // Store the current account name for later retrieval
  if (account) {
    await keytar.setPassword(SERVICE_NAME, CURRENT_ACCOUNT_KEY, account);
  }
}

/**
 * Get the current account name
 */
async function getCurrentAccount(): Promise<string> {
  const keytar = await getKeytar();
  const account = await keytar.getPassword(SERVICE_NAME, CURRENT_ACCOUNT_KEY);
  return account || DEFAULT_ACCOUNT_NAME;
}

/**
 * Retrieve OAuth tokens from system keychain
 * @param account - Optional account identifier, uses current account if not provided
 */
export async function getTokens(account?: string): Promise<OAuthTokens | null> {
  const keytar = await getKeytar();
  const accountName = account || await getCurrentAccount();
  const tokenData = await keytar.getPassword(SERVICE_NAME, accountName);

  if (!tokenData) {
    // Try default account as fallback for backward compatibility
    if (accountName !== DEFAULT_ACCOUNT_NAME) {
      const defaultData = await keytar.getPassword(SERVICE_NAME, DEFAULT_ACCOUNT_NAME);
      if (defaultData) {
        try {
          return JSON.parse(defaultData) as OAuthTokens;
        } catch {}
      }
    }
    return null;
  }

  try {
    return JSON.parse(tokenData) as OAuthTokens;
  } catch (error) {
    return null;
  }
}

/**
 * Delete OAuth tokens from system keychain
 * @param account - Optional account identifier, uses current account if not provided
 */
export async function deleteTokens(account?: string): Promise<boolean> {
  const keytar = await getKeytar();
  const accountName = account || await getCurrentAccount();

  // Delete tokens for the account
  const deleted = await keytar.deletePassword(SERVICE_NAME, accountName);

  // If this was the current account, also delete the current account reference
  const currentAccount = await getCurrentAccount();
  if (currentAccount === accountName) {
    await keytar.deletePassword(SERVICE_NAME, CURRENT_ACCOUNT_KEY);
  }

  return deleted;
}

/**
 * Check if access token is expired or will expire soon
 * @param bufferSeconds - Consider expired if expires within this many seconds (default: 60)
 */
export function isTokenExpired(tokens: OAuthTokens, bufferSeconds: number = 60): boolean {
  const now = Math.floor(Date.now() / 1000);
  return tokens.expires_at <= (now + bufferSeconds);
}

/**
 * Check if OAuth tokens exist in keychain
 */
export async function hasTokens(): Promise<boolean> {
  try {
    const tokens = await getTokens();
    return tokens !== null;
  } catch (error) {
    return false;
  }
}
