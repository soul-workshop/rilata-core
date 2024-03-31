import { JwtCreator } from '../../app/jwt/jwt-creator';
import { JwtPayload, JwtType } from '../../app/jwt/types';
import { ServerResolver } from '../../app/server/server-resolver';
import { JwtHmacHashUtils } from '../../common/utils/jwt/jwt-utils';
import { DTO } from '../../domain/dto';

export class JwtCreatorImpl<PAYLOAD extends DTO> implements JwtCreator<PAYLOAD> {
  protected resolver!: ServerResolver<PAYLOAD>;

  init(resolver: ServerResolver<PAYLOAD>): void {
    this.resolver = resolver;
  }

  createToken(payload: PAYLOAD, type: JwtType): string {
    const secret = this.resolver.getJwtSecretKey();
    const { algorithm } = this.resolver.getJwtConfig();
    const jwtUtils = new JwtHmacHashUtils();
    return jwtUtils.sign(
      this.getJwtPayload(payload, type),
      secret,
      algorithm === 'HS256' ? 'sha256' : 'sha512',
    );
  }

  protected getJwtPayload(
    payload: PAYLOAD, typ: JwtType,
  ): JwtPayload<PAYLOAD> {
    const expiredAsHour = typ === 'access'
      ? this.resolver.getJwtConfig().jwtLifetimeAsHour
      : this.resolver.getJwtConfig().jwtRefreshLifetimeAsHour;
    const iat = this.resolver.getJwtDecoder().getNow();

    const jwtLifetimeAsMs = expiredAsHour * 60 * 60 * 1000;
    const exp = iat + jwtLifetimeAsMs;

    return { ...payload, exp, typ };
  }
}
