import { DTO } from '../../domain/dto';
import { Result } from '../../common/result/types';
import { JwtDecodeErrors } from './jwt-errors';
import { ServerResolver } from '../server/server-resolver';

export interface JwtDecoder<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<PAYLOAD>): void
  /** Декодировать токен и получить его payload. Не проверяется валидность токена. */
  getTokenPayload(rawToken: string): Result<JwtDecodeErrors, PAYLOAD>;

  /** Возваращает ошибки jwt, добавлена как публичная для jwtCreator, jwtVerifier */
  getError<E extends JwtDecodeErrors>(name: E['name']): Result<E, never>

  /** Истекла ли дата refresh токена. Если токен некорректный, то возвращает true. */
  refreshDateIsExpired(rawToken: string): boolean

  /** Добавлено для возможности мока в тестах */
  getNow(): number
}
