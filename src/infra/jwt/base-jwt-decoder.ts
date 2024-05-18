/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IncorrectTokenError, JwtDecodeErrors,
  NotValidTokenPayloadError, TokenExpiredError,
} from '../../app/jwt/jwt-errors';
import { JwtDecoder } from '../../app/jwt/jwt-decoder';
import { DTO } from '../../domain/dto';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';
import { JwtPayload, JwtType } from '../../app/jwt/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { JwtHmacHashUtils } from '../../common/utils/jwt/jwt-utils';
import { GeneralServerResolver } from '../../app/server/types';
import { UnionToTuple } from '../../common/tuple-types';

/** Класс для декодирования JWT токена. */
export abstract class BaseJwtDecoder<
  PAYLOAD extends DTO
> implements JwtDecoder<PAYLOAD> {
  /** Уменьшает время реального истечения токена на указанное значение.
    Для бэка скорее всего 0, для фронта например 3000 */
  protected abstract expiredTimeShiftAsMs: number;

  /** Возвращает ответ, что тело payload соответвует требуемому */
  abstract payloadBodyIsValid(payload: PAYLOAD): boolean

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(resolver: GeneralServerResolver): void {}

  getTokenPayload(rawToken: string): Result<JwtDecodeErrors, PAYLOAD> {
    const decodedPayload = this.decodeJwt(rawToken);
    if (decodedPayload === undefined) return this.getError('IncorrectTokenError');

    if (this.dateIsExpired(decodedPayload)) return this.getError('TokenExpiredError');

    const keys: UnionToTuple<keyof JwtPayload<Record<never, unknown>>> = ['exp', 'typ'];
    const payload = dtoUtility.excludeAttrs(decodedPayload, keys) as unknown as PAYLOAD;
    return this.payloadBodyIsValid(payload) ? success(payload) : this.getError('NotValidTokenPayloadError');
  }

  getTokenType(rawToken: string): JwtType | undefined {
    const decodedPayload = this.decodeJwt(rawToken);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return decodedPayload?.typ;
  }

  dateIsExpired(rawOrPayload: string | JwtPayload<PAYLOAD>): boolean {
    const decodedPayload = typeof rawOrPayload === 'string'
      ? this.decodeJwt(rawOrPayload)
      : rawOrPayload;
    if (
      !decodedPayload
      || typeof decodedPayload?.exp !== 'number'
    ) return true;
    return (this.getNow() + this.expiredTimeShiftAsMs) - decodedPayload.exp > 0;
  }

  /** Добавлено для возможности мока в тестах */
  getNow(): number {
    return Date.now();
  }

  getError<E extends JwtDecodeErrors>(name: E['name']): Result<E, never> {
    if (name === 'IncorrectTokenError') {
      return failure(dodUtility.getDomainError<IncorrectTokenError>(
        'IncorrectTokenError',
        'Невозможно расшифровать токен. Токен имеет не верный формат.',
        {},
      )) as Result<E, never>;
    }
    if (name === 'NotValidTokenPayloadError') {
      return failure(dodUtility.getDomainError<NotValidTokenPayloadError>(
        'NotValidTokenPayloadError',
        'Невалидная полезная нагрузка в токене.',
        {},
      )) as Result<E, never>;
    }
    return failure(dodUtility.getDomainError<TokenExpiredError>(
      'TokenExpiredError',
      'Токен просрочен.',
      {},
    )) as Result<E, never>;
  }

  protected decodeJwt(rawToken: string): JwtPayload<PAYLOAD> | undefined {
    const jwtHmacUtils = new JwtHmacHashUtils();
    try {
      const result = jwtHmacUtils.getPayload(rawToken);
      return (
        !result
        || typeof result !== 'object'
        || typeof result?.exp !== 'number'
        || typeof result?.typ !== 'string'
        || ['access', 'refresh'].includes(result.typ) === false
      ) ? undefined : result as JwtPayload<PAYLOAD>;
    } catch (err) {
      return undefined;
    }
  }
}
