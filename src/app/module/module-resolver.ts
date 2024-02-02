import { Databaseable } from '../resolves/databaseable';
import { Repositoriable } from '../resolves/repositoriable';
import { Loggable } from '../resolves/loggable';
import { Realisable } from '../resolves/realisable';
import { Module } from '../module/module';
import { RunMode } from '../types';
import { ServerResolver } from '../server/server-resovler';
import { Logger } from '../../common/logger/logger';
import { Database } from '../database/database';
import { Bus } from '../bus/bus';
import { ModuleConfig } from './types';
import { DomainEventRepository } from '../database/domain-event-repository';

export abstract class ModuleResolver<M extends Module>
implements Loggable, Repositoriable, Databaseable, Realisable {
  protected module!: M;

  protected serverResolver!: ServerResolver;

  abstract getModuleConfig(): ModuleConfig;

  abstract getDatabase(): Database

  abstract getEventRepository(): DomainEventRepository

  abstract getRealisation(...args: unknown[]): unknown

  abstract getRepository(...args: unknown[]): unknown

  init(module: M, serverResolver: ServerResolver): void {
    this.module = module;
    this.serverResolver = serverResolver;
  }

  getLogger(): Logger {
    return this.serverResolver.getLogger();
  }

  getRunMode(): RunMode {
    return this.serverResolver.getRunMode();
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  getModule(): M {
    return this.module;
  }
}
