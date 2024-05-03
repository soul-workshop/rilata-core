import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { JwtCreator } from '../jwt/jwt-creator';
import { JwtDecoder } from '../jwt/jwt-decoder';
import { JwtVerifier } from '../jwt/jwt-verifier';
import { RunMode } from '../types';
import { RilataServer } from './server';
import { ServerResolves } from './server-resolves';
import { JwtConfig, ServerConfig } from './types';

export class ServerResolver<JWT_P extends DTO> {
  // eslint-disable-next-line no-use-before-define
  protected server!: RilataServer<JWT_P>;

  constructor(protected resolves: ServerResolves<JWT_P>) {}

  /** инициализация выполняется классом server */
  init(server: RilataServer<JWT_P>): void {
    this.server = server;
    [
      this.resolves.jwtVerifier,
      this.resolves.jwtDecoder,
      this.resolves.jwtCreator,
    ].forEach((initiable) => {
      initiable.init(this);
    });
  }

  getServerPath(): string {
    // @ts-ignore
    return import.meta.dir; // path/to/file
  }

  getProjectPath(): string {
    return process.cwd(); // path/to/project
  }

  getServer(): RilataServer<JWT_P> {
    return this.server;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(): void {}

  getServerConfig(): Required<ServerConfig> {
    return {
      hostname: this.resolves.serverConfig.hostname ?? 'localhost',
      port: this.resolves.serverConfig.port ?? 3000,
      loggerModes: this.resolves.serverConfig.loggerModes ?? 'all',
    };
  }

  getJwtDecoder(): JwtDecoder<JWT_P> {
    return this.resolves.jwtDecoder;
  }

  getJwtVerifier(): JwtVerifier<JWT_P> {
    return this.resolves.jwtVerifier;
  }

  getJwtCreator(): JwtCreator<JWT_P> {
    return this.resolves.jwtCreator;
  }

  getJwtSecretKey(): string {
    return this.resolves.jwtSecretKey;
  }

  getJwtConfig(): Required<JwtConfig> {
    return {
      algorithm: this.resolves.jwtConfig?.algorithm ?? 'HS256',
      jwtLifetimeAsHour: this.resolves.jwtConfig?.jwtLifetimeAsHour ?? 24,
      jwtRefreshLifetimeAsHour: this.resolves.jwtConfig?.jwtRefreshLifetimeAsHour ?? (24 * 3),
    };
  }

  getLogger(): Logger {
    return this.resolves.logger;
  }

  getRunMode(): RunMode {
    return this.resolves.runMode;
  }

  protected initStarted(): void {
    this.getLogger().info(`start init server resolver ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.getLogger().info(`finish init server resolver ${this.constructor.name}`);
  }
}
