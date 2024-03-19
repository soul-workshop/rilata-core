import { JwtCreator } from '../../app/jwt/jwt-creator';
import { JwtPayload } from '../../app/jwt/types';
import { ServerResolver } from '../../app/server/server-resolver';
import { JwtHmacUtils } from '../../common/utils/jwt/jwt-utils';
import { DTO } from '../../domain/dto';

export class JwtCreatorImpl<PAYLOAD extends DTO> implements JwtCreator<PAYLOAD> {
  protected resolver!: ServerResolver<PAYLOAD>;

  init(resolver: ServerResolver<PAYLOAD>): void {
    this.resolver = resolver;
  }

  createToken(payload: PAYLOAD): string {
    const secret = this.resolver.getJwtSecretKey();
    const { algorithm } = this.resolver.getJwtConfig();
    const jwtUtils = new JwtHmacUtils();
    return jwtUtils.sign(this.getJwtPayload(payload), secret, algorithm === 'HS256' ? 'sha256' : 'sha512');
  }

  protected getJwtPayload(payload: PAYLOAD): JwtPayload<PAYLOAD> {
    const { jwtLifetimeAsHour, jwtRefreshLifetimeAsHour } = this.resolver.getJwtConfig();
    const iat = this.resolver.getJwtDecoder().getNow();

    const jwtLifetimeAsMs = jwtLifetimeAsHour * 60 * 60 * 1000;
    const exp = iat + jwtLifetimeAsMs;

    const jwtRefreshLifetimeAsMs = jwtRefreshLifetimeAsHour * 60 * 60 * 1000;
    const rExp = iat + jwtRefreshLifetimeAsMs;

    return { ...payload, exp, rExp };
  }
}
