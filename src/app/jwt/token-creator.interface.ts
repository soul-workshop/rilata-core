import { DTO } from '../../domain/dto';
import { GeneralModuleResolver } from '../module/types';
import { Realisable } from '../resolves/realisable';
import { JWTTokens } from './types';

export interface TokenCreator<PAYLOAD extends DTO> {
  init(resolver: GeneralModuleResolver): void
  createToken(payload: PAYLOAD): JWTTokens;
  getHashedToken(tokens: JWTTokens): string;
}

export const TokenCreator = {
  instance(realisable: Realisable): TokenCreator<DTO> {
    return realisable.getRealisation(TokenCreator) as TokenCreator<DTO>;
  },
};
