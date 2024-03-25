import { Constructor } from '../../common/types';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';
import { ModuleResolves } from '../module/module-resolves';
import { BusServerResolver } from './bus-server-resolver';
import { RilataServer } from './server';
import { ServerResolver } from './server-resolver';
import { BusServerResolves, ServerResolves } from './server-resolves';
import { ModuleConstructors } from './types';

export class ServerStarter<JWT_P extends DTO, M extends Module<JWT_P>> {
  constructor(
    protected ServerCtor: Constructor<RilataServer<JWT_P>>,
    protected serverResolves: ServerResolves<JWT_P> | BusServerResolves<JWT_P>,
    protected ModuleCtors: ModuleConstructors<M>[],
  ) {}

  protected server: RilataServer<JWT_P> | undefined;

  start(runModules: M['moduleName'][] | 'all'): RilataServer<JWT_P> {
    const resolver = (this.serverResolves as BusServerResolves<JWT_P>).bus === undefined
      ? new ServerResolver(this.serverResolves)
      : new BusServerResolver(this.serverResolves as BusServerResolves<JWT_P>);
    const modules = this.getModules(runModules, resolver);
    this.server = new this.ServerCtor(modules);
    this.server.init(resolver);
    return this.server;
  }

  protected getModules(
    runModuleNames: M['moduleName'][] | 'all',
    serverResolver: ServerResolver<JWT_P>,
  ): M[] {
    const { logger } = this.serverResolves;
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
      const moduleResolver = new ModuleResolverCtor(resolves) as ModuleResolver<JWT_P, M, ModuleResolves<M>>;
      module.init(moduleResolver, serverResolver);

      logger.info(`  | end init module: ${name}`);
      return module;
    });
  }
}
