/* eslint-disable @typescript-eslint/no-unused-vars */
import { Constructor } from '../../common/types';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { RilataServer } from './server';
import { ServerResolver } from './s-resolver';
import { ServerResolves } from './s-resolves';
import { GeneralServerResolver, ModuleConstructors } from './types';

export class ServerStarter<M extends Module> {
  protected server!: RilataServer;

  protected serverResolver: GeneralServerResolver;

  constructor(
    protected ServerCtor: Constructor<RilataServer>,
    protected resolves:ServerResolves<DTO>,
    protected ModuleCtors: ModuleConstructors<M>[],
  ) {
    this.serverResolver = this.createResolver();
  }

  createResolver(): ServerResolver<ServerResolves<DTO>> {
    return new ServerResolver(this.resolves);
  }

  start(runModules: M['moduleName'][] | 'all'): RilataServer {
    const modules = this.getModules(runModules);
    this.startServer(modules);
    return this.server;
  }

  protected startServer(modules: M[]): void {
    this.server = new this.ServerCtor(modules);
    this.server.init(this.serverResolver);
  }

  protected getModules(runModuleNames: M['moduleName'][] | 'all'): M[] {
    const { logger } = this.resolves;
    if (runModuleNames === 'all') {
      runModuleNames = this.ModuleCtors.map(([Mctor, _1, _2]) => Mctor.name);
    }

    logger.info(`start init modules, count: ${runModuleNames.length}`);
    return runModuleNames.map((name) => {
      logger.info(`--- start init of module: ${name}`);
      const Ctors = this.ModuleCtors.find(
        ([ModuleCtor, _1, _2]) => ModuleCtor.name === name,
      );
      if (Ctors === undefined) {
        throw logger.error(`not finded module by name: ${name}`);
      }

      const [ModuleCtor, ModuleResolverCtor, resolves] = Ctors;
      const module = new ModuleCtor();
      // eslint-disable-next-line max-len
      const moduleResolver = new ModuleResolverCtor(resolves);
      module.init(moduleResolver, this.serverResolver);

      logger.info(`  | end init module: ${name}`);
      return module;
    });
  }
}
