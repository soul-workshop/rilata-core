import { Repositoriable } from '../resolves/repositoriable';
import { Realisable } from '../resolves/realisable';
import { Module } from '../module/module';
import { RunMode } from '../types';
import { ServerResolver } from '../server/server-resolver';
import { Logger } from '../../common/logger/logger';
import { Facadable } from '../resolves/facadable';
import { ModuleResolves } from './module-resolves';
import { JwtVerifier } from '../jwt/jwt-verifier';
import { DTO } from '../../domain/dto';
import { ModuleResolveInstance } from '../resolves/types';
import { JwtDecoder } from '../jwt/jwt-decoder';

export abstract class ModuleResolver<
  JWT_P extends DTO, M extends Module<JWT_P>, MR extends ModuleResolves<M>,
>
implements Repositoriable, Realisable, Facadable {
  protected module!: M;

  protected serverResolver!: ServerResolver<JWT_P>;

  abstract resolve(...args: unknown[]): unknown

  abstract resolveRepo(...args: unknown[]): ModuleResolveInstance

  abstract resolveFacade(...args: unknown[]): ModuleResolveInstance

  constructor(protected resolves: MR) {}

  /** инициализация выполняется классом server */
  init(module: M, serverResolver: ServerResolver<JWT_P>): void {
    this.module = module;
    this.serverResolver = serverResolver;

    this.initResolves();
    this.getDatabase().init(this);
  }

  stop(): void {
    this.getDatabase().stop();
  }

  getServerResolver(): ServerResolver<JWT_P> {
    return this.serverResolver;
  }

  getDatabase(): MR['db'] {
    return this.resolves.db;
  }

  getModuleUrls(): string[] {
    return this.resolves.moduleUrls;
  }

  getJwtDecoder(): JwtDecoder<JWT_P> {
    return this.serverResolver.getJwtDecoder();
  }

  getJwtVerifier(): JwtVerifier<JWT_P> {
    return this.serverResolver.getJwtVerifier();
  }

  getLogger(): Logger {
    return this.serverResolver.getLogger();
  }

  getRunMode(): RunMode {
    return this.serverResolver.getRunMode();
  }

  getModuleName(): string {
    return this.resolves.moduleName;
  }

  getModule(): M {
    return this.module;
  }

  protected initResolves(): void {
    Object.entries(this.resolves).forEach(([key, resolveItem]) => {
      if (
        (resolveItem as any).init
        && typeof (resolveItem as any).init === 'function'
      ) (resolveItem as any).init(this);
    });
  }
}
