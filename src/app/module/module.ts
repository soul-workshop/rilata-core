/* eslint-disable no-use-before-define */
import { Logger } from '../../common/logger/logger';
import { GeneralCommandService, GeneraQueryService } from '../service/types';
import { Service } from '../service/service';
import { ModuleType } from './types';
import { ModuleResolver } from './module-resolver';
import { EventDelivererWorkerProxy } from '../event-deliverer/event-deliverer-worker';

export abstract class Module {
  readonly abstract moduleType: ModuleType;

  readonly abstract moduleName: string;

  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  protected moduleResolver!: ModuleResolver<Module>;

  protected services!: Service[];

  protected logger!: Logger;

  async init(moduleResolver: ModuleResolver<Module>): Promise<void> {
    this.moduleResolver = moduleResolver;
    moduleResolver.init(this); // сперва нужно инициализировать resolver
    this.logger = moduleResolver.getLogger();
    this.services = [...this.queryServices, ...this.commandServices];
    this.services.forEach((service) => service.init(moduleResolver));

    const eventDelivererWorkerProxy = new EventDelivererWorkerProxy();
    eventDelivererWorkerProxy.init(moduleResolver);
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
