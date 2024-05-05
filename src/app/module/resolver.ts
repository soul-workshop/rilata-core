import { Repositoriable } from '../resolves/repositoriable';
import { Realisable } from '../resolves/realisable';
import { ServerResolver } from '../server/server-resolver';
import { Facadable } from '../resolves/facadable';
import { ModuleResolves } from './resolves';
import { DTO } from '../../domain/dto';
import { ModuleResolveInstance } from '../resolves/types';
import { GetModuleType } from './types';
import { ServerResolves } from '../server/server-resolves';
import { Module } from './module';
import { GetServerResolves } from '../server/types';

export abstract class ModuleResolver<
  S_RES extends ServerResolver<ServerResolves<DTO>>, MR extends ModuleResolves<Module>,
>
implements Repositoriable, Realisable, Facadable {
  protected module!: GetModuleType<MR>;

  protected serverResolver!: S_RES;

  abstract resolve(...args: unknown[]): unknown

  abstract resolveRepo(...args: unknown[]): ModuleResolveInstance

  abstract resolveFacade(...args: unknown[]): ModuleResolveInstance

  constructor(protected resolves: MR) {}

  getModulePath(): string {
    // @ts-ignore
    return import.meta.dir; // path/to/file
  }

  getProjectPath(): string {
    return this.serverResolver.getProjectPath();
  }

  init(module: GetModuleType<MR>, serverResolver: S_RES): void {
    this.module = module;
    this.serverResolver = serverResolver;

    this.initResolves();
    this.getDatabase().init(this);
  }

  stop(): void {
    this.getDatabase().stop();
  }

  getServerResolver(): S_RES {
    return this.serverResolver;
  }

  getModuleResolves(): MR {
    return this.resolves;
  }

  getLogger(): GetServerResolves<S_RES>['logger'] {
    return this.serverResolver.getLogger();
  }

  getDatabase(): MR['db'] {
    return this.resolves.db;
  }

  getModuleUrls(): MR['moduleUrls'] {
    return this.resolves.moduleUrls;
  }

  getModuleName(): MR['moduleName'] {
    return this.resolves.moduleName;
  }

  getModule(): GetModuleType<MR> {
    return this.module;
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
