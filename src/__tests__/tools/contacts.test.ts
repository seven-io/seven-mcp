import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { listContacts, createContact, getContact, updateContact, deleteContact, contactsTools } from '../../tools/contacts.js';
import { createMockClient, mockSuccessResponse } from '../helpers/mockClient.js';

describe('Contacts Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('listContacts', () => {
    it('should list all contacts', async () => {
      const mockResponse = { contacts: [{ id: '1', nick: 'John' }] };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await listContacts(mockClient);

      expect(mockClient.get).toHaveBeenCalledWith('/contacts');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createContact', () => {
    it('should create a new contact', async () => {
      const params = { nick: 'John', empfaenger: '+1234567890' };
      const mockResponse = { id: '1', ...params };
      mockClient.post.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await createContact(mockClient, params);

      expect(mockClient.post).toHaveBeenCalledWith('/contacts', params, { formEncoded: true });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getContact', () => {
    it('should get contact by ID', async () => {
      const id = '123';
      const mockResponse = { id, nick: 'John' };
      mockClient.get.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await getContact(mockClient, id);

      expect(mockClient.get).toHaveBeenCalledWith(`/contacts/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateContact', () => {
    it('should update contact', async () => {
      const id = '123';
      const params = { nick: 'Jane' };
      const mockResponse = { id, ...params };
      mockClient.patch.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await updateContact(mockClient, id, params);

      expect(mockClient.patch).toHaveBeenCalledWith(`/contacts/${id}`, params, { formEncoded: true });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteContact', () => {
    it('should delete contact', async () => {
      const id = '123';
      const mockResponse = { success: true };
      mockClient.delete.mockReturnValue(mockSuccessResponse(mockResponse));

      const result = await deleteContact(mockClient, id);

      expect(mockClient.delete).toHaveBeenCalledWith(`/contacts/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('contactsTools definitions', () => {
    it('should export correct tool definitions', () => {
      expect(contactsTools).toHaveLength(5);
      expect(contactsTools.map(t => t.name)).toEqual([
        'list_contacts',
        'create_contact',
        'get_contact',
        'update_contact',
        'delete_contact'
      ]);
    });
  });
});
