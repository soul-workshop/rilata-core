import { Result } from '../../common/result/types';
import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/server-resolver';
import { JwtVerifyErrors } from './jwt-errors';

export interface JwtVerifier<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<PAYLOAD>): void
  /** Проверяет токен на соответствие шифрованию секретом */
  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD>
}
