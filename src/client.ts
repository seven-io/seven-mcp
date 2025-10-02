import axios, { AxiosInstance } from 'axios';
import type { SevenConfig } from './types.js';
import { getValidAccessToken } from './oauth/refresh.js';
import { getTokens } from './oauth/tokens.js';

export class SevenClient {
  private client: AxiosInstance;
  private apiKey?: string;
  private clientId?: string;
  private useOAuth: boolean = false;

  constructor(config: SevenConfig) {
    this.apiKey = config.apiKey;
    this.clientId = config.clientId;
    const baseUrl = config.baseUrl || 'https://gateway.seven.io/api';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to handle authentication
    this.client.interceptors.request.use(async (config) => {
      // Try OAuth first if client ID is provided
      if (this.clientId) {
        try {
          const tokens = await getTokens();
          if (tokens) {
            const accessToken = await getValidAccessToken(this.clientId);
            config.headers.Authorization = `Bearer ${accessToken}`;
            this.useOAuth = true;
            return config;
          }
        } catch (error) {
          // Fall through to API key
        }
      }

      // Fallback to API key
      if (this.apiKey) {
        config.headers['X-API-Key'] = this.apiKey;
      } else if (!this.useOAuth) {
        throw new Error('No authentication method available. Please set SEVEN_API_KEY or run "seven-mcp login"');
      }

      return config;
    });
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }

  private encodeFormData(data: Record<string, any>): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        // For arrays, append each value with array bracket notation
        value.forEach((item) => params.append(`${key}[]`, item));
      } else if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    return params.toString();
  }

  async post<T>(path: string, data?: Record<string, any>, options?: { formEncoded?: boolean }): Promise<T> {
    const config = options?.formEncoded
      ? {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: [(data: any) => this.encodeFormData(data)]
        }
      : {};
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async patch<T>(path: string, data?: Record<string, any>, options?: { formEncoded?: boolean }): Promise<T> {
    const config = options?.formEncoded
      ? {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: [(data: any) => this.encodeFormData(data)]
        }
      : {};
    const response = await this.client.patch<T>(path, data, config);
    return response.data;
  }

  async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}
