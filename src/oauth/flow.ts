import axios from 'axios';
import open from 'open';
import readline from 'readline';
import { generateCodeVerifier, generateCodeChallenge, generateState } from './pkce.js';
import { startCallbackServer, findAvailablePort } from './server.js';
import { storeTokens, OAuthTokens } from './tokens.js';

const AUTHORIZE_ENDPOINT = 'https://oauth.seven.io/authorize';
const TOKEN_ENDPOINT = 'https://oauth.seven.io/token';
const ME_ENDPOINT = 'https://oauth.seven.io/me';

export interface OAuthConfig {
  clientId: string;
  scope?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope?: string;
}

interface UserInfo {
  user_id: string;
  email: string;
  [key: string]: any;
}

/**
 * Wait for user to press ENTER
 */
async function waitForEnter(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Press ENTER to open your browser for authentication...', () => {
      rl.close();
      resolve();
    });
  });
}

/**
 * Perform complete OAuth 2.0 authorization code flow with PKCE
 * @param config - OAuth configuration
 * @returns OAuth tokens
 */
export async function performOAuthFlow(config: OAuthConfig): Promise<OAuthTokens> {
  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  console.log('\n🔐 Starting OAuth authentication flow...');

  // Find an available port from the configured OAuth ports (7177, 9437, 8659)
  const port = await findAvailablePort();
  console.log(`📡 Starting callback server on port ${port}...`);

  // Start the callback server on the available port
  const callbackPromise = startCallbackServer(port, state);

  const redirectUri = `http://127.0.0.1:${port}/callback`;

  // Build authorization URL
  const authUrl = new URL(AUTHORIZE_ENDPOINT);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);

  if (config.scope) {
    authUrl.searchParams.set('scope', config.scope);
  }

  // Wait for user confirmation
  await waitForEnter();

  console.log('🌐 Opening browser for authentication...');
  await open(authUrl.toString());

  console.log('⏳ Waiting for authorization (complete login in your browser)...');

  // Wait for callback
  const { code } = await callbackPromise;

  console.log('✅ Authorization received!');
  console.log('🔄 Exchanging authorization code for tokens...');

  // Exchange authorization code for tokens
  const tokens = await exchangeCodeForTokens(config.clientId, code, codeVerifier, redirectUri);

  console.log('👤 Fetching user information...');

  // Fetch user info to get account details
  const userInfo = await fetchUserInfo(tokens.access_token);

  console.log(`✨ Authenticated as: ${userInfo.email || userInfo.user_id}`);

  // Store tokens securely with user-specific account
  await storeTokens(tokens, userInfo.email || userInfo.user_id);

  return tokens;
}

/**
 * Fetch user information using the access token
 * @param accessToken - OAuth access token
 * @returns User information
 */
async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  try {
    const response = await axios.get<UserInfo>(ME_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // Return a default user if /me endpoint fails
    return {
      user_id: 'default',
      email: 'oauth-user',
    };
  }
}

/**
 * Exchange authorization code for access token using PKCE
 * @param clientId - OAuth client ID
 * @param code - Authorization code from callback
 * @param codeVerifier - PKCE code verifier
 * @param redirectUri - The redirect URI used in the authorization request
 * @returns OAuth tokens
 */
async function exchangeCodeForTokens(
  clientId: string,
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<OAuthTokens> {
  try {
    const params = {
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    };

    const response = await axios.post<TokenResponse>(
      TOKEN_ENDPOINT,
      new URLSearchParams(params).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresAt = Math.floor(Date.now() / 1000) + response.data.expires_in;

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: expiresAt,
      token_type: response.data.token_type,
      scope: response.data.scope,
    };
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Failed to exchange code for tokens: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
    }
    throw new Error(`Failed to exchange code for tokens: ${error.message}`);
  }
}
