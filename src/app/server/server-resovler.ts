import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { Bus } from '../bus/bus';
import { TokenVerifier } from '../jwt/token-verifier.interface';
import { RunMode } from '../types';

export abstract class ServerResolver {
  abstract init(serverResolver: ServerResolver): void

  abstract getServerConfig(): unknown;

  abstract getBus(): Bus

  abstract getLogger(): Logger

  abstract getTokenVerifier(): TokenVerifier<DTO>

  abstract getRunMode(): RunMode
}
