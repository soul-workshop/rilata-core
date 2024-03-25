import { createHmac } from 'crypto';
import { DTO } from '../../../domain/dto';

type Base64Url = string;

export class JwtHmacHashUtils<T extends DTO | string> {
  /** returned jwt token */
  sign(payload: T, secretKey: string, algorithm: 'sha256' | 'sha512'): string {
    const alg = algorithm === 'sha256' ? 'HS256' : 'HS512';
    const headerAsBase64 = this.encodeToBase64Url({ alg, typ: 'JWT' });
    const payloadAsBase64 = this.encodeToBase64Url(payload);
    const headerAndPayloadAsBase64 = `${headerAsBase64}.${payloadAsBase64}`;
    const signAsBase64 = this.getHmacSign(headerAndPayloadAsBase64, secretKey, algorithm);
    return `${headerAndPayloadAsBase64}.${signAsBase64}`;
  }

  /** verify jwt token by secret key and return result */
  verify(raw: string, secretKey: string, algorithm: 'sha256' | 'sha512'): boolean {
    const headerAndPayloadAsBase64 = raw.replace(/\.[^.]+$/gm, '');
    const signAsBase64 = this.getHmacSign(headerAndPayloadAsBase64, secretKey, algorithm);
    return raw === `${headerAndPayloadAsBase64}.${signAsBase64}`;
  }

  /** return jwt token payload */
  getPayload(raw: string): T | undefined {
    const payloadAsBase64 = raw.split('.')[1];
    if (!payloadAsBase64) return undefined;
    return this.decodeFromBase64Url(payloadAsBase64) as T;
  }

  // From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
  /** encode to base64Url hash */
  encodeToBase64Url(payload: DTO | string): Base64Url {
    const asJson = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const asByteArray = new TextEncoder().encode(asJson);
    return btoa(String.fromCodePoint(...asByteArray)).replace(/=+$/, '');
  }

  // From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
  /** decode from base64Utl hash */
  decodeFromBase64Url(hashed: Base64Url): DTO | string {
    // @ts-ignore
    const asByteArray = Uint8Array.from(atob(hashed), (m) => m.codePointAt(0));
    const asString = new TextDecoder().decode(asByteArray);
    try {
      return JSON.parse(asString);
    } catch (e) {
      return asString;
    }
  }

  protected getHmacSign(payload: string, secretKey: string, algorithm: 'sha256' | 'sha512'): string {
    const hmac = createHmac(algorithm, secretKey);
    hmac.update(payload);
    return hmac.digest('base64url');
  }
}
