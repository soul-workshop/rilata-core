import jwtDecode from 'jwt-decode';
import {
  IncorrectTokenError, JwtErrors, NotValidTokenPayloadError, TokenExpiredError,
} from '../../app/jwt/jwt-errors';
import { JWTDecoder } from '../../app/jwt/jwt-decoder';
import { DTO } from '../../domain/dto';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { JwtPayload } from '../../app/jwt/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';

/** Класс для декодирования JWT токена. */
export abstract class BaseJwtDecoder<
  PAYLOAD extends DTO
> implements JWTDecoder<PAYLOAD> {
  /** Уменьшает время реального истечения токена на указанное значение.
    Для бэка скорее всего 0, для фронта например 3000 */
  abstract expiredTimeShiftAsMs: number;

  /** Проверить, что тело payload соответвует требуемому */
  abstract verifyPayloadBody(payload: PAYLOAD): boolean

  getTokenPayload(rawToken: string): Result<JwtErrors, PAYLOAD> {
    const decodedPayload = this.decodeToken(rawToken);
    if (
      !decodedPayload
      || typeof decodedPayload?.exp !== 'number'
    ) return this.getError('IncorrectTokenError');

    if (this.dateIsExpired(decodedPayload)) return this.getError('TokenExpiredError');

    const payload = dtoUtility.excludeAttrs(decodedPayload, 'exp') as unknown as PAYLOAD;
    return this.verifyPayloadBody(payload) ? success(payload) : this.getError('NotValidTokenPayloadError');
  }

  protected decodeToken(rawToken: string): JwtPayload<PAYLOAD> | undefined {
    try {
      return jwtDecode(rawToken);
    } catch (err) {
      return undefined;
    }
  }

  protected dateIsExpired(payload: JwtPayload<PAYLOAD>): boolean {
    return (this.getNow() + this.expiredTimeShiftAsMs) - payload.exp > 0;
  }

  /** Добавлено для возможности мока в тестах */
  protected getNow(): number {
    return Date.now();
  }

  protected getError(name: JwtErrors['name']): Result<JwtErrors, never> {
    if (name === 'IncorrectTokenError') {
      return failure(dodUtility.getDomainError<IncorrectTokenError>(
        'IncorrectTokenError',
        'Невозможно расшифровать токен. Токен имеет не верный формат.',
        {},
      ));
    } if (name === 'NotValidTokenPayloadError') {
      return failure(dodUtility.getDomainError<NotValidTokenPayloadError>(
        'NotValidTokenPayloadError',
        'Невалидная полезная нагрузка в токене.',
        {},
      ));
    }
    return failure(dodUtility.getDomainError<TokenExpiredError>(
      'TokenExpiredError',
      'Токен просрочен.',
      {},
    ));
  }
}
