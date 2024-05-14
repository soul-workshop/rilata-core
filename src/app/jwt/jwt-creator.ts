import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/s-resolver';
import { ServerResolves } from '../server/s-resolves';
import { JwtType } from './types';

export interface JwtCreator<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<ServerResolves<PAYLOAD>>): void
  createToken(payload: PAYLOAD, type: JwtType): string;
}
