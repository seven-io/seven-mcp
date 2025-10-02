import axios from 'axios';
import { OAuthTokens, storeTokens, getTokens, isTokenExpired } from './tokens.js';

const TOKEN_ENDPOINT = 'https://oauth.seven.io/token';

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope?: string;
}

/**
 * Refresh OAuth access token using refresh token
 * @param clientId - OAuth client ID
 * @param refreshToken - Current refresh token
 * @returns New OAuth tokens
 */
export async function refreshAccessToken(
  clientId: string,
  refreshToken: string
): Promise<OAuthTokens> {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: refreshToken,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresAt = Math.floor(Date.now() / 1000) + response.data.expires_in;

    const newTokens: OAuthTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: expiresAt,
      token_type: response.data.token_type,
      scope: response.data.scope,
    };

    // Store new tokens
    await storeTokens(newTokens);

    return newTokens;
  } catch (error: any) {
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
}

/**
 * Get valid access token, refreshing if necessary
 * @param clientId - OAuth client ID
 * @returns Valid access token
 */
export async function getValidAccessToken(clientId: string): Promise<string> {
  let tokens = await getTokens();

  if (!tokens) {
    throw new Error('No OAuth tokens found. Please run: npx seven-mcp login');
  }

  // Refresh if expired or expiring soon
  if (isTokenExpired(tokens)) {
    tokens = await refreshAccessToken(clientId, tokens.refresh_token);
  }

  return tokens.access_token;
}
