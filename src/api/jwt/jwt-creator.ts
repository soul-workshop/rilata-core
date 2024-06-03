import { JwtType } from '../../core/jwt/types';
import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/s-resolver';
import { ServerResolves } from '../server/s-resolves';

export interface JwtCreator<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<ServerResolves<PAYLOAD>>): void
  createToken(payload: PAYLOAD, type: JwtType): string;
}
