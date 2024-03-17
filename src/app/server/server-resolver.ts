import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { TokenVerifier } from '../jwt/jwt-verifier';
import { RunMode } from '../types';
import { RilataServer } from './server';

export abstract class ServerResolver {
  protected server!: RilataServer;

  /** инициализация выполняется классом server */
  init(server: RilataServer): void {
    this.initStarted();
    this.server = server;
    this.initFinished();
  }

  getServer(): RilataServer {
    return this.server;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(): void {}

  abstract getServerConfig(): unknown;

  abstract getLogger(): Logger

  abstract getTokenVerifier(): TokenVerifier<DTO>

  abstract getRunMode(): RunMode

  protected initStarted(): void {
    this.getLogger().info(`start init server resolver ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.getLogger().info(`finish init server resolver ${this.constructor.name}`);
  }
}
