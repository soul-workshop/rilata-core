import { DTO } from '../../domain/dto';
import { Realisable } from '../resolves/realisable';
import { JWTTokens } from './types';

export interface TokenCreator<PAYLOAD extends DTO> {
  createToken(payload: PAYLOAD): JWTTokens;
}

export const TokenCreator = {
  instance(realisable: Realisable): TokenCreator<DTO> {
    return realisable.getRealisation(TokenCreator) as TokenCreator<DTO>;
  },
};
