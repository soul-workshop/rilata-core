import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/server-resolver';

export interface JwtCreator<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<PAYLOAD>): void
  createToken(payload: PAYLOAD): string;
}
