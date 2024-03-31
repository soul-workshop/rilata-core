import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/server-resolver';
import { JwtType } from './types';

export interface JwtCreator<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<PAYLOAD>): void
  createToken(payload: PAYLOAD, type: JwtType): string;
}
