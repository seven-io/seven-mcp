import { describe, it, expect, jest } from '@jest/globals';
import { rcsTools } from '../../tools/rcs.js';
import { smsTools } from '../../tools/sms.js';
import { voiceTools } from '../../tools/voice.js';
import { accountTools } from '../../tools/account.js';
import { lookupTools } from '../../tools/lookup.js';
import { statusTools } from '../../tools/status.js';
import { numbersTools } from '../../tools/numbers.js';
import { contactsTools } from '../../tools/contacts.js';
import { groupsTools } from '../../tools/groups.js';
import { subaccountsTools } from '../../tools/subaccounts.js';
import { webhooksTools } from '../../tools/webhooks.js';
import { senderTools } from '../../tools/sender.js';

describe('Integration Tests', () => {
  describe('All Tools Export', () => {
    it('should export all tool categories', () => {
      expect(rcsTools).toBeDefined();
      expect(smsTools).toBeDefined();
      expect(voiceTools).toBeDefined();
      expect(accountTools).toBeDefined();
      expect(lookupTools).toBeDefined();
      expect(statusTools).toBeDefined();
      expect(numbersTools).toBeDefined();
      expect(contactsTools).toBeDefined();
      expect(groupsTools).toBeDefined();
      expect(subaccountsTools).toBeDefined();
      expect(webhooksTools).toBeDefined();
      expect(senderTools).toBeDefined();
    });

    it('should have at least 40 tools total', () => {
      const allTools = [
        ...rcsTools,
        ...smsTools,
        ...voiceTools,
        ...accountTools,
        ...lookupTools,
        ...statusTools,
        ...numbersTools,
        ...contactsTools,
        ...groupsTools,
        ...subaccountsTools,
        ...webhooksTools,
        ...senderTools,
      ];

      expect(allTools.length).toBeGreaterThanOrEqual(40);
    });

    it('should have unique tool names', () => {
      const allTools = [
        ...rcsTools,
        ...smsTools,
        ...voiceTools,
        ...accountTools,
        ...lookupTools,
        ...statusTools,
        ...numbersTools,
        ...contactsTools,
        ...groupsTools,
        ...subaccountsTools,
        ...webhooksTools,
        ...senderTools,
      ];

      const names = allTools.map(t => t.name);
      const uniqueNames = new Set(names);

      expect(names.length).toBe(uniqueNames.size);
    });

    it('should have valid inputSchema for all tools', () => {
      const allTools = [
        ...rcsTools,
        ...smsTools,
        ...voiceTools,
        ...accountTools,
        ...lookupTools,
        ...statusTools,
        ...numbersTools,
        ...contactsTools,
        ...groupsTools,
        ...subaccountsTools,
        ...webhooksTools,
        ...senderTools,
      ];

      allTools.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      });
    });

    it('should have descriptions for all tools', () => {
      const allTools = [
        ...rcsTools,
        ...smsTools,
        ...voiceTools,
        ...accountTools,
        ...lookupTools,
        ...statusTools,
        ...numbersTools,
        ...contactsTools,
        ...groupsTools,
        ...subaccountsTools,
        ...webhooksTools,
        ...senderTools,
      ];

      allTools.forEach(tool => {
        expect(tool.description).toBeDefined();
        expect(tool.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Tool Categories', () => {
    it('should have correct number of RCS tools', () => {
      expect(rcsTools.length).toBe(3);
    });

    it('should have correct number of SMS tools', () => {
      expect(smsTools.length).toBe(2);
    });

    it('should have correct number of Voice tools', () => {
      expect(voiceTools.length).toBe(2);
    });

    it('should have correct number of Account tools', () => {
      expect(accountTools.length).toBe(3);
    });

    it('should have correct number of Lookup tools', () => {
      expect(lookupTools.length).toBe(5);
    });

    it('should have correct number of Status tools', () => {
      expect(statusTools.length).toBe(4);
    });

    it('should have correct number of Numbers tools', () => {
      expect(numbersTools.length).toBe(6);
    });

    it('should have correct number of Contacts tools', () => {
      expect(contactsTools.length).toBe(5);
    });

    it('should have correct number of Groups tools', () => {
      expect(groupsTools.length).toBe(5);
    });

    it('should have correct number of Subaccounts tools', () => {
      expect(subaccountsTools.length).toBe(5);
    });

    it('should have correct number of Webhooks tools', () => {
      expect(webhooksTools.length).toBe(3);
    });

    it('should have correct number of Sender tools', () => {
      expect(senderTools.length).toBe(1);
    });
  });
});
