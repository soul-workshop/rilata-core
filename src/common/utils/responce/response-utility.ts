/* eslint-disable no-underscore-dangle */
import { stat, readFile } from 'fs/promises';
import JSZip from 'jszip';

type Options = {
  status?: number,
  encode?: BufferEncoding,
}

class ResponseUtility {
  createJsonResponse(data: unknown, status = 200): Response {
    try {
      return this.createJson(data, status);
    } catch (err) {
      return this.createError(err as Error, 'json');
    }
  }

  async createFileResponse(filePath: string, options?: Options): Promise<Response> {
    try {
      const fileStat = await stat(filePath);
      const fileContent = await readFile(filePath, options?.encode ?? 'utf8');

      const headers = {
        'Content-Type': 'application/octet-stream', // Или другой тип в зависимости от расширения файла
        'Content-Length': fileStat.size.toString(),
        'Content-Disposition': `attachment; filename="${filePath.split('/').pop()}"`,
      };

      return new Response(fileContent, {
        status: options?.status ?? 200,
        headers,
      });
    } catch (err) {
      return this.createError(err as Error, 'file');
    }
  }

  async createZipFileResponse(filePath: string, options?: Options): Promise<Response> {
    try {
      const fileName = filePath.split('/').pop();
      if (!fileName) throw Error('not found file');
      const fileContent = await readFile(filePath, options?.encode ?? 'utf8');

      const zip = new JSZip();
      zip.file(fileName, fileContent);

      const zipContent = await zip.generateAsync({ type: 'uint8array' });
      const headers = {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}.zip"`,
        'Content-Length': zipContent.length.toString(),
      };

      return new Response(zipContent, { status: options?.status ?? 200, headers });
    } catch (err) {
      return this.createError(err as Error, 'file');
    }
  }

  private createError(err: Error, errType: string): Response {
    return this.createJson({
      type: `fail ${errType} response create error`,
      message: (err as Error).message || `create file ${errType} response error`,
      stack: (err as Error).stack || 'trace stack not found',
    }, 500);
  }

  private createJson(data: unknown, status: number): Response {
    const jsonString = JSON.stringify(data);
    const contentLength = Buffer.byteLength(jsonString, 'utf8');
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': contentLength.toString(),
    };
    return new Response(jsonString, {
      status,
      headers,
    });
  }
}

export const responceUtility = new ResponseUtility();
