import { createGzip, createDeflate, brotliCompressSync } from 'zlib';
import { RilataRequest } from '../../http.index';
import { GeneralModuleResolver } from '../../module/types';
import { GeneralServerResolver } from '../../server/types';
import { Afterware } from '../afterware';

export class CompressionAfterware<
  R extends GeneralServerResolver | GeneralModuleResolver
> extends Afterware<R> {
  process(req: RilataRequest, resp: Response): Response {
    const acceptEncoding = req.headers.get('accept-encoding') || '';

    // Получаем сырые данные из тела ответа
    const originalBody = new Uint8Array(await resp.arrayBuffer());
    
    let compressedContent: Buffer;
    let encoding: string | null = null;

    if (acceptEncoding.includes('br')) {
      compressedContent = brotliCompressSync(Buffer.from(originalBody));
      encoding = 'br';
    } else if (acceptEncoding.includes('gzip')) {
      compressedContent = this.compressWithStream(Buffer.from(originalBody), createGzip);
      encoding = 'gzip';
    } else if (acceptEncoding.includes('deflate')) {
      compressedContent = this.compressWithStream(Buffer.from(originalBody), createDeflate);
      encoding = 'deflate';
    } else {
      return resp;
    }

    const headers = new Headers(resp.headers);
    headers.set('Content-Encoding', encoding);
    headers.set('Content-Length', compressedContent.length.toString());

    // Обновление имени файла в заголовке Content-Disposition для attachment
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition && contentDisposition.startsWith('attachment')) {
      const fileNameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (fileNameMatch && !fileNameMatch[1].endsWith('.zip')) {
        const newFileName = `${fileNameMatch[1]}.zip`;
        headers.set('Content-Disposition', `attachment; filename="${newFileName}"`);
      }
    }

    return new Response(compressedContent, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  }

  private compressWithStream(buffer: Buffer, createStream: () => NodeJS.ReadWriteStream): Buffer {
    const chunks: Buffer[] = [];
    const stream = createStream();

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.end(buffer);

    return Buffer.concat(chunks);
  }
}
