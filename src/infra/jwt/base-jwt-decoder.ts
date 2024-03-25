import {
  IncorrectTokenError, JwtDecodeErrors,
  NotValidTokenPayloadError, RefreshTokenExpiredError, TokenExpiredError,
} from '../../app/jwt/jwt-errors';
import { JwtDecoder } from '../../app/jwt/jwt-decoder';
import { DTO } from '../../domain/dto';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { JwtPayload } from '../../app/jwt/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { ServerResolver } from '../../app/server/server-resolver';
import { JwtHmacHashUtils } from '../../common/utils/jwt/jwt-utils';

/** Класс для декодирования JWT токена. */
export abstract class BaseJwtDecoder<
  PAYLOAD extends DTO
> implements JwtDecoder<PAYLOAD> {
  /** Уменьшает время реального истечения токена на указанное значение.
    Для бэка скорее всего 0, для фронта например 3000 */
  abstract expiredTimeShiftAsMs: number;

  /** Возвращает ответ, что тело payload соответвует требуемому */
  abstract payloadBodyIsValid(payload: PAYLOAD): boolean

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(resolver: ServerResolver<PAYLOAD>): void {}

  getTokenPayload(rawToken: string): Result<JwtDecodeErrors, PAYLOAD> {
    const decodedPayload = this.decodeJwt(rawToken);
    if (
      !decodedPayload
      || typeof decodedPayload?.exp !== 'number'
      || typeof decodedPayload?.rExp !== 'number'
    ) return this.getError('IncorrectTokenError');

    if (this.accessDateIsExpired(decodedPayload)) return this.getError('TokenExpiredError');

    const payload = dtoUtility.excludeAttrs(decodedPayload, ['exp', 'rExp']) as unknown as PAYLOAD;
    return this.payloadBodyIsValid(payload) ? success(payload) : this.getError('NotValidTokenPayloadError');
  }

  accessDateIsExpired(rawOrPayload: string | JwtPayload<PAYLOAD>): boolean {
    const decodedPayload = typeof rawOrPayload === 'string'
      ? this.decodeJwt(rawOrPayload)
      : rawOrPayload;
    if (
      !decodedPayload
      || typeof decodedPayload?.exp !== 'number'
    ) return true;
    return (this.getNow() + this.expiredTimeShiftAsMs) - decodedPayload.exp > 0;
  }

  refreshDateIsExpired(rawToken: string): boolean {
    const payload = this.decodeJwt(rawToken);
    return (
      !payload
      || typeof payload?.rExp !== 'number'
      || this.getNow() - payload.rExp > 0
    );
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
    if (name === 'TokenExpiredError') {
      return failure(dodUtility.getDomainError<TokenExpiredError>(
        'TokenExpiredError',
        'Токен просрочен.',
        {},
      )) as Result<E, never>;
    }
    return failure(dodUtility.getDomainError<RefreshTokenExpiredError>(
      'RefreshTokenExpiredError',
      'Рефреш токен просрочен',
      {},
    )) as Result<E, never>;
  }

  protected decodeJwt(rawToken: string): JwtPayload<PAYLOAD> | undefined {
    const jwtHmacUtils = new JwtHmacHashUtils();
    try {
      const result = jwtHmacUtils.getPayload(rawToken);
      return typeof result !== 'object' ? undefined : result as JwtPayload<PAYLOAD>;
    } catch (err) {
      return undefined;
    }
  }
}
