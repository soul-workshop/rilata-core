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
import { EventDelivererWorkerProxy } from '../event-deliverer/event-deliverer-worker';

export abstract class ModuleResolver<M extends Module>
implements Loggable, Repositoriable, Databaseable, Realisable {
  protected module!: M;

  abstract moduleConfig: ModuleConfig;

  abstract getDatabase(): Database

  abstract getEventRepository(): DomainEventRepository

  abstract getRealisation(...args: unknown[]): unknown

  abstract getRepository(...args: unknown[]): unknown

  constructor(protected serverResolver: ServerResolver) {}

  /** инициализация выполняется классом server */
  async init(module: M): Promise<void> {
    this.module = module;

    const path = this.moduleConfig.eventDelivererPath;
    const file = Bun.file(path);
    if (await file.exists() === false) {
      throw this.getLogger().error(`not finded file by path ${path}`);
    }
  }

  getEventDelivererWorker(): EventDelivererWorkerProxy {
    const e = new EventDelivererWorkerProxy();
    e.init(this);
    return e;
  }

  getModuleConfig(): ModuleConfig {
    return this.moduleConfig;
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
