import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { RunMode } from '../types';
import { ServerResolver } from './server-resolver';
import { ModuleConstructors } from './types';

export abstract class RilataServer<JWT_P extends DTO> {
  protected abstract moduleTupleCtors: ModuleConstructors<JWT_P>[];

  protected runModules: Module<JWT_P>[] = [];

  protected resolver!: ServerResolver<JWT_P>;

  protected logger!: Logger;

  constructor(
    protected runModuleNames: string[] | 'all',
    protected runMode: RunMode,
  ) {}

  init(serverResolver: ServerResolver<JWT_P>): void {
    serverResolver.init(this);
    this.logger = serverResolver.getLogger();
    this.logger.info(`${this.constructor.name} server init started`);
    this.resolver = serverResolver;

    this.initModules();
  }

  stop(): void {
    this.resolver.stop();
    this.runModules.forEach((m) => m.stop());
  }

  getModule<M extends Module<JWT_P>>(name: M['moduleName']): M {
    const module = this.runModules.find((m) => m.moduleName === name);
    if (module === undefined) {
      throw this.logger.error(`not finded module by name: ${name}`, this.runModules);
    }
    return module as M;
  }

  getModules(): Module<JWT_P>[] {
    return this.runModules;
  }

  getServerResolver(): ServerResolver<JWT_P> {
    return this.resolver;
  }

  protected initModules(): void {
    if (this.runModuleNames === 'all') {
      this.runModuleNames = this.moduleTupleCtors.map(([Mctor, _1, _2]) => Mctor.name);
    }

    this.logger.info(`start init modules, count: ${this.runModuleNames.length}`);
    this.runModules = this.runModuleNames.map((name) => {
      this.logger.info(`--- start init of module: ${name}`);
      const Ctors = this.moduleTupleCtors.find(
        ([ModuleCtor, _1, _2]) => ModuleCtor.name === name,
      );
      if (Ctors === undefined) {
        throw this.resolver.getLogger().error(`not finded module by name: ${name}`);
      }

      const [ModuleCtor, ModResolverCtor, getResolves] = Ctors;
      const module = new ModuleCtor();
      const resolver = new ModResolverCtor(getResolves(this.runMode));
      module.init(resolver, this.resolver);

      this.logger.info(`  | end init module: ${name}`);
      return module;
    });
  }

  protected initStarted(): void {
    this.logger.info(`start init server ${this.constructor.name}`);
  }

  protected initFinished(): void {
    this.logger.info(`finish init server ${this.constructor.name}`);
  }
}
