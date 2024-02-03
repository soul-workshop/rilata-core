import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';
import { ServerResolver } from './server-resovler';
import { ModuleConstructors } from './types';

export abstract class Server {
  protected abstract moduleConstructors: ModuleConstructors<Module>[];

  protected runModules: Module[] = [];

  protected resolver!: ServerResolver;

  constructor(protected runModuleNames: string[]) {}

  async init(serverResolver: ServerResolver): Promise<void> {
    this.resolver = serverResolver;
    this.resolver.init();
    const modulesAndResolvers = this.moduleConstructors.map(([ModuleCtor, ModResolverCtor]) => [
      new ModuleCtor(),
      new ModResolverCtor(),
    ] as [Module, ModuleResolver<Module>]);

    this.runModules = this.runModuleNames.map((name) => {
      const moduleAndResolver = modulesAndResolvers.find(([m, _]) => m.moduleName === name);
      if (moduleAndResolver === undefined) {
        throw this.resolver.getLogger().error(`not finded module by name: ${name}`);
      }
      const [module, resolver] = moduleAndResolver;
      module.init(resolver);
      this.runModules.push(module);
      return module;
    });
  }

  getModules(): Module[] {
    return this.runModules;
  }
}
