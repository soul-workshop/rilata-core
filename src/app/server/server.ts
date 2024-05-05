import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { ServerResolver } from './server-resolver';

export abstract class RilataServer {
  protected resolver!: ServerResolver<JWT_P>;

  protected logger!: Logger;

  constructor(protected modules: Module<JWT_P>[]) {}

  init(serverResolver: ServerResolver<JWT_P>): void {
    serverResolver.init(this);
    this.logger = serverResolver.getLogger();
    this.resolver = serverResolver;
  }

  stop(): void {
    this.resolver.stop();
    this.modules.forEach((m) => m.stop());
  }

  getModule<M extends Module<JWT_P>>(name: M['moduleName']): M {
    const module = this.modules.find((m) => m.moduleName === name);
    if (module === undefined) {
      throw this.logger.error(`not finded module by name: ${name}`, this.modules);
    }
    return module as M;
  }

  getModules(): Module<JWT_P>[] {
    return this.modules;
  }

  getServerResolver(): ServerResolver<JWT_P> {
    return this.resolver;
  }

  protected initStarted(): void {
    this.logger.info(`start init server ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.logger.info(`finish init server ${this.constructor.name}`);
  }
}
