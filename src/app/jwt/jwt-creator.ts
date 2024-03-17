import { DTO } from '../../domain/dto';
import { GeneralModuleResolver } from '../module/types';
import { Realisable } from '../resolves/realisable';
import { JwtPayload } from './types';

export interface TokenCreator<PAYLOAD extends DTO> {
  init(resolver: GeneralModuleResolver): void
  createToken(payload: PAYLOAD): string;
  getJwtPayload(payload: PAYLOAD): JwtPayload<PAYLOAD>;
}

export const TokenCreator = {
  instance(realisable: Realisable): TokenCreator<DTO> {
    return realisable.getRealisation(TokenCreator) as TokenCreator<DTO>;
  },
};
