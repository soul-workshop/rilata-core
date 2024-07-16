/* eslint-disable @typescript-eslint/no-explicit-any */
import { DTO } from '../../domain/dto.js';
import { RilataServer } from './server.js';
import { ServerResolves } from './s-resolves.js';
import { ServerConfig } from './types.js';

export class ServerResolver<RES extends ServerResolves<DTO>> {
  protected server!: RilataServer;

  constructor(protected resolves: RES) {}

  /** инициализация выполняется классом server */
  init(server: RilataServer): void {
    this.server = server;

    this.initResolves();
  }

  getServerPath(): string {
    return import.meta.dir; // path/to/file
  }

  getProjectPath(): string {
    return process.cwd(); // path/to/project
  }

  getServer(): RilataServer {
    return this.server;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(): void {}

  getServerResolves(): RES {
    return this.resolves;
  }

  getServerConfig(): ServerConfig {
    return this.resolves.serverConfig;
  }

  getPublicHost(): string {
    return this.resolves.publicHost;
  }

  getPublicPort(): number {
    return this.resolves.publicPort;
  }

  getPublicHttpUrl(): string {
    const port = this.getPublicPort() === 80 ? '' : `:${this.getPublicPort()}`;
    return `http://${this.getPublicHost()}${port}`;
  }

  getPublicHttspUrl(): string {
    const port = this.getPublicPort() === 443 ? '' : `:${this.getPublicPort()}`;
    return `https://${this.getPublicHost()}${port}`;
  }

  getPublicUrl(): string {
    const { httpsPorts } = this.resolves;
    return httpsPorts.includes(this.getPublicPort())
      ? this.getPublicHttspUrl()
      : this.getPublicHttpUrl();
  }

  getJwtDecoder(): RES['jwtDecoder'] {
    return this.resolves.jwtDecoder;
  }

  getJwtVerifier(): RES['jwtVerifier'] {
    return this.resolves.jwtVerifier;
  }

  getJwtCreator(): RES['jwtCreator'] {
    return this.resolves.jwtCreator;
  }

  getLogger(): RES['logger'] {
    return this.resolves.logger;
  }

  getRunMode(): RES['runMode'] {
    return this.resolves.runMode;
  }

  protected initStarted(): void {
    this.getLogger().info(`start init server resolver ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.getLogger().info(`finish init server resolver ${this.constructor.name}`);
  }

  protected initResolves(): void {
    Object.values(this.resolves).forEach((resolveItem) => {
      if (
        (resolveItem as any).init
        && typeof (resolveItem as any).init === 'function'
      ) (resolveItem as any).init(this);
    });
  }
}
