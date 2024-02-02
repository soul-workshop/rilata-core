/* eslint-disable no-use-before-define */
import { Logger } from '../../common/logger/logger';
import { ModuleResolver } from '../resolves/module-resolver';
import { GeneralCommandService, GeneraQueryService } from '../service/types';
import { Service } from '../service/service';
import { ModuleType } from './types';

export abstract class Module {
  readonly abstract moduleType: ModuleType;

  readonly abstract moduleName: string;

  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  protected moduleResolver!: ModuleResolver<Module>;

  protected services!: Service[];

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver<Module>): void {
    this.moduleResolver = moduleResolver;
    moduleResolver.init(this);
    this.logger = moduleResolver.getLogger();
    this.services = [...this.queryServices, ...this.commandServices];
    this.services.forEach((service) => service.init(moduleResolver));
  }

  getServiceByName(name: string): Service {
    const service = this.services.find((s) => s.getName() === name);
    if (service === undefined) {
      throw this.logger.error(
        `not finded in module "${this.moduleName}" service by name "${name}"`,
        { serviceNames: this.services.map((s) => s.getName()) },
      );
    }
    return service;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getModuleName(): string {
    return this.moduleName;
  }
}
