import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import { SevenClient } from '../client.js';
import type { OAuthTokens } from '../oauth/tokens.js';

jest.mock('axios');
jest.mock('../oauth/tokens.js', () => ({
  getTokens: jest.fn<() => Promise<OAuthTokens | null>>().mockResolvedValue(null),
}));
jest.mock('../oauth/refresh.js', () => ({
  getValidAccessToken: jest.fn(),
}));

const mockedAxios = axios as any;

describe('SevenClient', () => {
  let client: SevenClient;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    } as any);
    client = new SevenClient({ apiKey: mockApiKey });
  });

  it('should create client with API key', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://gateway.seven.io/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should create client with custom base URL', () => {
    const customUrl = 'https://custom.api.com';
    new SevenClient({ apiKey: mockApiKey, baseUrl: customUrl });

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: customUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should make GET requests', async () => {
    const mockData = { success: true };
    const mockAxiosInstance = mockedAxios.create() as any;
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);
    const testClient = new SevenClient({ apiKey: mockApiKey });

    const result = await testClient.get('/test', { param: 'value' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { params: { param: 'value' } });
    expect(result).toEqual(mockData);
  });

  it('should make POST requests', async () => {
    const mockData = { success: true };
    const mockAxiosInstance = mockedAxios.create() as any;
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);
    const testClient = new SevenClient({ apiKey: mockApiKey });

    const result = await testClient.post('/test', { key: 'value' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', { key: 'value' }, {});
    expect(result).toEqual(mockData);
  });

  it('should make PATCH requests', async () => {
    const mockData = { success: true };
    const mockAxiosInstance = mockedAxios.create() as any;
    mockAxiosInstance.patch.mockResolvedValue({ data: mockData });

    mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);
    const testClient = new SevenClient({ apiKey: mockApiKey });

    const result = await testClient.patch('/test', { key: 'value' });

    expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test', { key: 'value' }, {});
    expect(result).toEqual(mockData);
  });

  it('should make DELETE requests', async () => {
    const mockData = { success: true };
    const mockAxiosInstance = mockedAxios.create() as any;
    mockAxiosInstance.delete.mockResolvedValue({ data: mockData });

    mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);
    const testClient = new SevenClient({ apiKey: mockApiKey });

    const result = await testClient.delete('/test');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test');
    expect(result).toEqual(mockData);
  });
});
