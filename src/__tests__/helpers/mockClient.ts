import { jest } from '@jest/globals';
import { SevenClient } from '../../client.js';

export function createMockClient(): SevenClient {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as any;

  return mockClient;
}

export function mockSuccessResponse<T>(data: T) {
  return Promise.resolve(data);
}

export function mockErrorResponse(message: string) {
  return Promise.reject(new Error(message));
}
