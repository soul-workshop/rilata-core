import { DTO } from '../../domain/dto';
import { TokenVerifier } from '../jwt/token-verifier.interface';
import { Loggable } from './loggable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerResolver extends Loggable {
  getTokenVerifier(): TokenVerifier<DTO>
}
