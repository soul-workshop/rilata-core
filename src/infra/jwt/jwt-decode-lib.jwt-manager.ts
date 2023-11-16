import jwtDecode from 'jwt-decode';
import { InvalidTokenError } from '../../app/jwt/errors';
import { JWTManager } from '../../app/jwt/jwt-manager.interface';
import { DecodedToken } from '../../app/jwt/types';
import { DTO } from '../../domain/dto';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';

/** Класс для декодирования JWT токена. */
export abstract class JWTDecodeLibJWTManager<
  PAYLOAD extends DTO
> implements JWTManager<PAYLOAD> {
  decodeToken(rawToken: string): Result<InvalidTokenError, DecodedToken<PAYLOAD>> {
    let decodedInfo: DecodedToken<PAYLOAD>;
    try {
      decodedInfo = jwtDecode(rawToken);
    } catch (err) {
      return failure(dodUtility.getDomainErrorByType<InvalidTokenError>(
        'InvalidTokenError',
        'Невозможно расшифровать токен. Токен имеет не верный формат.',
        { rawToken: `${rawToken}` },
      ));
    }
    return success(decodedInfo);
  }

  getTokenPayload(rawToken: string): Result<InvalidTokenError, PAYLOAD> {
    const decodeResult = this.decodeToken(rawToken);
    if (decodeResult.isFailure()) return failure(decodeResult.value);
    return success(decodeResult.value.payload);
  }
}
