import { Repositoriable } from '../resolves/repositoriable';
import { Realisable } from '../resolves/realisable';
import { Module } from '../module/module';
import { RunMode } from '../types';
import { ServerResolver } from '../server/server-resolver';
import { Logger } from '../../common/logger/logger';
import { ModuleConfig } from './types';
import { Facadable } from '../resolves/facadable';
import { ModuleResolves } from './module-resolves';
import { TokenVerifier } from '../jwt/jwt-verifier';
import { DTO } from '../../domain/dto';
import { ModuleResolveInstance } from '../resolves/types';

export abstract class ModuleResolver<M extends Module, MR extends ModuleResolves<M>>
implements Repositoriable, Realisable, Facadable {
  protected module!: M;

  protected serverResolver!: ServerResolver;

  protected abstract moduleConfig: ModuleConfig;

  abstract getRealisation(...args: unknown[]): ModuleResolveInstance

  abstract getRepository(...args: unknown[]): ModuleResolveInstance

  abstract getFacade(...args: unknown[]): ModuleResolveInstance

  constructor(protected resolves: MR) {}

  /** инициализация выполняется классом server */
  init(module: M, serverResolver: ServerResolver): void {
    this.module = module;
    this.serverResolver = serverResolver;

    this.initResolves();
    this.getDatabase().init(this);
  }

  stop(): void {
    this.getDatabase().stop();
  }

  getServerResolver(): ServerResolver {
    return this.serverResolver;
  }

  getDatabase(): MR['db'] {
    return this.resolves.db;
  }

  getModuleConfig(): ModuleConfig {
    return this.moduleConfig;
  }

  getTokenVerifier(): TokenVerifier<DTO> {
    return this.serverResolver.getTokenVerifier();
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
