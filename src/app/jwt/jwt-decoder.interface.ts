import { DTO } from '../../domain/dto';
import { Result } from '../../common/result/types';
import { InvalidTokenError } from './errors';
import { DecodedToken } from './types';

export interface JWTDecoder<PAYLOAD extends DTO> {
  /** Декодировать токен. Не проверяется валидность токена. */
  decodeToken(rawToken: string): Result<InvalidTokenError, DecodedToken<PAYLOAD>>

  /** Декодировать токен и получить его payload. Не проверяется валидность токена. */
  getTokenPayload(rawToken: string): Result<InvalidTokenError, PAYLOAD>;
}
