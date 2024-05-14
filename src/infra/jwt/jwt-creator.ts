import { JwtCreator } from '../../app/jwt/jwt-creator';
import { JwtPayload, JwtType } from '../../app/jwt/types';
import { GeneralServerResolver, JwtConfig } from '../../app/server/types';
import { JwtHmacHashUtils } from '../../common/utils/jwt/jwt-utils';
import { DTO } from '../../domain/dto';

export class JwtCreatorImpl<PAYLOAD extends DTO> implements JwtCreator<PAYLOAD> {
  protected resolver!: GeneralServerResolver;

  constructor(protected jwtSecret: string, protected jwtConfig: JwtConfig) {}

  init(resolver: GeneralServerResolver): void {
    this.resolver = resolver;
  }

  createToken(payload: PAYLOAD, type: JwtType): string {
    const jwtUtils = new JwtHmacHashUtils();
    return jwtUtils.sign(
      this.getJwtPayload(payload, type),
      this.jwtSecret,
      this.jwtConfig.algorithm === 'HS256' ? 'sha256' : 'sha512',
    );
  }

  protected getJwtPayload(payload: PAYLOAD, typ: JwtType): JwtPayload<PAYLOAD> {
    const expiredAsHour = typ === 'access'
      ? this.jwtConfig.jwtLifetimeAsHour
      : this.jwtConfig.jwtRefreshLifetimeAsHour;
    const iat = this.resolver.getJwtDecoder().getNow();

    const jwtLifetimeAsMs = expiredAsHour * 60 * 60 * 1000;
    const exp = iat + jwtLifetimeAsMs;

    return { ...payload, exp, typ };
  }
}
