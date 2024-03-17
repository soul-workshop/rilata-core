import { Result } from '../../common/result/types';
import { DTO } from '../../domain/dto';
import { GeneralModuleResolver } from '../module/types';
import { Realisable } from '../resolves/realisable';
import { JwtErrors } from './jwt-errors';

export interface TokenVerifier<PAYLOAD extends DTO> {
  init(resolver: GeneralModuleResolver): void
  verifyToken(rawToken: string): Result<JwtErrors, PAYLOAD>
}

export const TokenVerifier = {
  instance<PAYLOAD extends DTO>(realisable: Realisable): TokenVerifier<PAYLOAD> {
    return realisable.getRealisation(TokenVerifier) as TokenVerifier<PAYLOAD>;
  },
};
