import { Result } from '../../common/result/types';
import { DTO } from '../../domain/dto';
import { VerifyTokenError } from './errors';
import { TokenType } from './types';

export interface TokenVerifier<PAYLOAD extends DTO> {
  verifyToken(rawToken: string, tokenType: TokenType): Result<VerifyTokenError, PAYLOAD>
}
