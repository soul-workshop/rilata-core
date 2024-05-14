import { JwtVerifyError, JwtVerifyErrors } from '../../app/jwt/jwt-errors';
import { JwtVerifier } from '../../app/jwt/jwt-verifier';
import { ServerResolver } from '../../app/server/s-resolver';
import { ServerResolves } from '../../app/server/s-resolves';
import { JwtConfig } from '../../app/server/types';
import { failure } from '../../common/result/failure';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';
import { JwtHmacHashUtils } from '../../common/utils/jwt/jwt-utils';
import { DTO } from '../../domain/dto';

export class JwtVerifierImpl<PAYLOAD extends DTO> implements JwtVerifier<PAYLOAD> {
  protected resolver!: ServerResolver<ServerResolves<PAYLOAD>>;

  constructor(protected jwtSecret: string, protected jwtConfig: JwtConfig) {}

  init(resolver: ServerResolver<ServerResolves<PAYLOAD>>): void {
    this.resolver = resolver;
  }

  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD> {
    const { algorithm } = this.jwtConfig;
    const jwtUtils = new JwtHmacHashUtils();
    if (!jwtUtils.verify(rawToken, this.jwtSecret, algorithm === 'HS256' ? 'sha256' : 'sha512')) {
      return failure(dodUtility.getDomainError<JwtVerifyError>(
        'JwtVerifyError',
        'Токен не валидный',
        {},
      ));
    }
    return this.resolver.getJwtDecoder().getTokenPayload(rawToken);
  }
}
