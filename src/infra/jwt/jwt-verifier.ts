import { JwtVerifyError, JwtVerifyErrors } from '../../app/jwt/jwt-errors';
import { JwtVerifier } from '../../app/jwt/jwt-verifier';
import { ServerResolver } from '../../app/server/server-resolver';
import { failure } from '../../common/result/failure';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { JwtHmacUtils } from '../../common/utils/jwt/jwt-utils';
import { DTO } from '../../domain/dto';

export class JwtVerifierImpl<PAYLOAD extends DTO> implements JwtVerifier<PAYLOAD> {
  protected resolver!: ServerResolver<PAYLOAD>;

  init(resolver: ServerResolver<PAYLOAD>): void {
    this.resolver = resolver;
  }

  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD> {
    const secret = this.resolver.getJwtSecretKey();
    const { algorithm } = this.resolver.getJwtConfig();
    const jwtUtils = new JwtHmacUtils();
    if (!jwtUtils.verify(rawToken, secret, algorithm === 'HS256' ? 'sha256' : 'sha512')) {
      return failure(dodUtility.getDomainError<JwtVerifyError>(
        'JwtVerifyError',
        'Токен не валидный',
        {},
      ));
    }
    return this.resolver.getJwtDecoder().getTokenPayload(rawToken);
  }
}
