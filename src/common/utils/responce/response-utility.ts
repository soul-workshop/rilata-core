/* eslint-disable no-underscore-dangle */
import { stat } from 'fs/promises';
import JSZip from 'jszip';
import { MimeTypes, ResponseFileOptions } from '../../../app/controller/types';
import { mimeTypesMap, dispositionTypeMap } from '../../../app/controller/constants';

class ResponseUtility {
  /**
   * Создает JSON-ответ.
   * @param data - Данные для включения в тело ответа.
   * @param status - HTTP статус ответа. По умолчанию 200.
   * @returns Ответ с данными в формате JSON.
   */
  createJsonResponse(data: unknown, status = 200): Response {
    try {
      return this.createJson(data, status);
    } catch (err) {
      return this.createError(err as Error, 'json');
    }
  }

  /**
   * Создает ответ с файлом.
   * @param filePath - Путь к файлу.
   * @param options - Опции для ответа.
   * @returns Ответ с содержимым файла.
   */
  async createFileResponse(filePath: string, options?: ResponseFileOptions): Promise<Response> {
    try {
      const fileSize = await this.fileSize(filePath);
      const mimeType = options?.mimeType ?? this.fileMimeType(filePath);
      const fileName = filePath.split('/').pop() ?? filePath;

      const shouldZip = options?.shouldZip ?? true;
      const disposition = options?.disposition ?? 'inline';
      const dispositionValue = disposition === 'inline'
        ? 'inline'
        : `${dispositionTypeMap[disposition]}${shouldZip ? `"${fileName}.zip"` : `"${fileName}"`}`;

      const headers: Record<string, string> = {
        'Content-Type': mimeTypesMap[mimeType],
        'Content-Length': fileSize,
        'Content-Disposition': dispositionValue,
      };

      let content: Uint8Array | string;
      if (shouldZip) {
        content = await this.compressFile(filePath);
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = content.length.toString();
      } else {
        content = await this.fileContent(filePath);
      }

      return new Response(content, {
        status: options?.status ?? 200,
        headers,
      });
    } catch (err) {
      return this.createError(err as Error, 'file');
    }
  }

  /**
   * Читает содержимое файла.
   * @param path - Путь к файлу.
   * @returns Промис, который возвращает содержимое файла как строку.
   */
  protected fileContent(path: string): Promise<string> {
    return Bun.file(path).text();
  }

  /**
   * Определяет размер файла.
   * @param path - Путь к файлу.
   * @returns Промис, который возвращает размер файла в байтах.
   */
  private async fileSize(path: string): Promise<string> {
    const fileStat = await stat(path);
    return fileStat.size.toString();
  }

  /**
   * Сжимает файл.
   * @param path - Путь к файлу.
   * @returns Промис, который возвращает сжатое содержимое файла.
   */
  private async compressFile(path: string): Promise<Uint8Array> {
    const zip = new JSZip();
    const fileName = path.split('/').pop() ?? path;
    zip.file(fileName, this.fileContent(path));
    return zip.generateAsync({ type: 'uint8array' });
  }

  /**
   * Создает JSON-ответ с сообщением об ошибке.
   * @param err - Объект ошибки.
   * @param errType - Тип ошибки file | json.
   * @returns Ответ с сообщением об ошибке в формате JSON.
   */
  private createError(err: Error, errType: string): Response {
    return this.createJson({
      type: `fail ${errType} response create error`,
      message: (err as Error).message || `create file ${errType} response error`,
      stack: (err as Error).stack || 'trace stack not found',
    }, 500);
  }

  /**
   * Создает JSON-ответ.
   * @param data - Данные для включения в тело ответа.
   * @param status - HTTP статус ответа.
   * @returns Ответ с данными в формате JSON.
   */
  private createJson(data: unknown, status: number): Response {
    const jsonString = JSON.stringify(data);
    const contentLength = Buffer.byteLength(jsonString);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': contentLength.toString(),
    };
    return new Response(jsonString, {
      status,
      headers,
    });
  }

  /**
   * Определяет MIME-тип файла на основе его расширения.
   * @param path - Путь к файлу.
   * @returns MIME-тип файла.
   */
  private fileMimeType(path: string): MimeTypes {
    const fileExt = path.split('.').pop();
    if (fileExt && fileExt in mimeTypesMap) return fileExt as MimeTypes;
    return 'txt';
  }
}

export const responseUtility = new ResponseUtility();
