import { DTO } from '../../domain/dto';
import { JWTTokens } from './types';

export interface TokenCreator<PAYLOAD extends DTO> {
  createToken(payload: PAYLOAD): JWTTokens;
}
