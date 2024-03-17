import { DTO } from '../../domain/dto';
import { Result } from '../../common/result/types';
import { JwtErrors } from './jwt-errors';

export interface JWTDecoder<PAYLOAD extends DTO> {
  /** Декодировать токен и получить его payload. Не проверяется валидность токена. */
  getTokenPayload(rawToken: string): Result<JwtErrors, PAYLOAD>;
}
