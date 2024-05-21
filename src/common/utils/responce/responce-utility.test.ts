import {
  describe, test, expect, beforeEach, jest,
  spyOn,
} from 'bun:test';
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

  describe('responce utility method createFileResponse', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    const textEncoder = new TextEncoder();

    test('should return a response with correct headers and content when shouldZip is true and not indecated mimeType', async () => {
      const mockFileContent = new Uint8Array([1, 2, 3, 4]);

      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileSize').mockResolvedValue('4');
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileContent').mockReturnValue('file content');
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'compressFile').mockResolvedValue(mockFileContent);

      const response = await responseUtility.createFileResponse('/dir/name.ext', {
        shouldZip: true,
        disposition: 'attachment',
      });

      const { headers } = response;
      expect(headers.get('Content-Type')).toBe('text/plain'); // default content type
      expect(headers.get('Content-Encoding')).toBe('gzip'); // should zip
      expect(headers.get('Content-Disposition')).toBe('attachment; filename="name.ext.zip"');
      expect(headers.get('Content-Length')).toBe('4');

      const content = await response.arrayBuffer();
      expect(new Uint8Array(content)).toEqual(mockFileContent);
    });

    test('should return a response with correct headers and content when shouldZip is false and indecated mimeType', async () => {
      const mockFileContent = 'file content';

      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileSize').mockResolvedValue(mockFileContent.length.toString());
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileContent').mockReturnValue(mockFileContent);

      const response = await responseUtility.createFileResponse('/dir/file.txt', {
        shouldZip: false,
        disposition: 'attachment',
      });

      const { headers } = response;
      expect(headers.get('Content-Type')).toBe('text/plain');
      expect(headers.get('Content-Disposition')).toBe('attachment; filename="file.txt"');
      expect(headers.get('Content-Length')).toBe(mockFileContent.length.toString());

      const content = await response.arrayBuffer();
      expect(new Uint8Array(content)).toEqual(textEncoder.encode(mockFileContent));
    });

    test('should return a response with correct headers and content for inline disposition', async () => {
      const mockFileContent = '<h1>Hello world!</h1>';

      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileSize').mockResolvedValue('21');
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileContent').mockReturnValue(mockFileContent);

      const response = await responseUtility.createFileResponse('/dir/index.html', {
        shouldZip: false,
        disposition: 'inline',
        status: 201,
      });

      const { headers } = response;
      expect(headers.get('Content-Type')).toBe('text/html');
      expect(headers.get('Content-Encoding')).toBeNull(); // should zip
      expect(headers.get('Content-Disposition')).toBe('inline');
      expect(headers.get('Content-Length')).toBe('21');
      expect(response.status).toBe(201);

      const content = await response.arrayBuffer();
      expect(new Uint8Array(content)).toEqual(textEncoder.encode(mockFileContent));
    });

    test('should handle errors correctly', async () => {
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileSize').mockResolvedValue('12');
      // @ts-expect-error private method mocked
      spyOn(responseUtility, 'fileContent').mockImplementation(() => {
        throw new Error('File not found');
      });

      const response = await responseUtility.createFileResponse('/dir/file.txt');

      const { headers } = response;

      expect(headers.get('Content-Type')).toBe('application/json');

      const content = await response.json();
      expect(Object.keys(content)).toEqual(['type', 'message', 'stack']);
      expect(content.type).toBe('fail file response create error');
      expect(content.message).toBe('File not found');
      expect(content.stack).toContain('at compressFile (');
    });
  });
});
