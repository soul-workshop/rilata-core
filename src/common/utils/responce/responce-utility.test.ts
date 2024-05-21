import { describe, test, expect } from 'bun:test';
import { responseUtility } from './response-utility';

describe('response utility tests', () => {
  describe('responce utility method createJsonResponse', () => {
    test('should return correct headers and body for a normal object', async () => {
      const data = { key: 'value', anotherKey: 'anotherValue' };
      const response = responseUtility.createJsonResponse(data) as Response;

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Content-Length')).toBe('43');
      expect(await response.text()).toBe('{"key":"value","anotherKey":"anotherValue"}');
    });

    test('should return correct headers and body for an empty object', async () => {
      const data = {};
      const response = responseUtility.createJsonResponse(data) as Response;

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Content-Length')).toBe('2');
      expect(await response.text()).toBe('{}');
    });

    test('should return correct headers and body for a nested object', async () => {
      const data = { key: { nestedKey: 'nestedValue' } };
      const response = responseUtility.createJsonResponse(data) as Response;

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Content-Length')).toBe('35');
      expect(await response.text()).toBe('{"key":{"nestedKey":"nestedValue"}}');
    });

    test('should return correct headers and body for an object with various types', async () => {
      const data = { number: 123, boolean: true, array: [1, 2, 3] };
      const response = responseUtility.createJsonResponse(data) as Response;

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Content-Length')).toBe('45');
      expect(await response.text()).toBe('{"number":123,"boolean":true,"array":[1,2,3]}');
    });
  });

  // не удалось замокать 'fs/promises' чтобы сделать тесты для createFileResponse
});
