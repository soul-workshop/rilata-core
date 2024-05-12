import { Logger } from '../../common/logger/logger';
import { Module } from '../module/module';
import { GeneralServerResolver } from './types';

export abstract class RilataServer {
  protected resolver!: GeneralServerResolver;

  protected logger!: Logger;

  constructor(protected modules: Module[]) {}

  init(serverResolver: GeneralServerResolver): void {
    serverResolver.init(this);
    this.logger = serverResolver.getLogger();
    this.resolver = serverResolver;
  }

  stop(): void {
    this.resolver.stop();
    this.modules.forEach((m) => m.stop());
  }

  getModule<M extends Module>(name: M['moduleName']): M {
    const module = this.modules.find((m) => m.moduleName === name);
    if (module === undefined) {
      throw this.logger.error(`not finded module by name: ${name}`, this.modules);
    }
    return module as M;
  }

  getModules(): Module[] {
    return this.modules;
  }

  getServerResolver(): GeneralServerResolver {
    return this.resolver;
  }

  protected initStarted(): void {
    this.logger.info(`start init server ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.logger.info(`finish init server ${this.constructor.name}`);
  }
}
