import { Result } from '../../common/result/types';
import { DTO } from '../../domain/dto';
import { Realisable } from '../resolves/realisable';
import { VerifyTokenError } from './errors';
import { TokenType } from './types';

export interface TokenVerifier<PAYLOAD extends DTO> {
  verifyToken(rawToken: string, tokenType: TokenType): Result<VerifyTokenError, PAYLOAD>
}

export const TokenVerifier = {
  instance<PAYLOAD extends DTO>(realisable: Realisable): TokenVerifier<PAYLOAD> {
    return realisable.getRealisation(TokenVerifier) as TokenVerifier<PAYLOAD>;
  },
};
