import { Result } from '../../common/result/types';
import { DTO } from '../../domain/dto';
import { ServerResolver } from '../server/s-resolver';
import { ServerResolves } from '../server/s-resolves';
import { JwtVerifyErrors } from './jwt-errors';

export interface JwtVerifier<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<ServerResolves<PAYLOAD>>): void
  /** Проверяет токен на соответствие шифрованию секретом */
  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD>
}
