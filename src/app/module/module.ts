/* eslint-disable no-use-before-define */
import { Logger } from '../../common/logger/logger';
import {
  GeneralCommandService, GeneralCommandServiceParams, GeneralEventService,
  GeneralQueryServiceParams, GeneraQueryService, ServiceResult,
} from '../service/types';
import { Service } from '../service/service';
import { GeneralModuleResolver, ModuleType } from './types';
import { ServerResolver } from '../server/server-resolver';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { StorePayload } from '../async-store/types';
import { Caller } from '../caller';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { failure } from '../../common/result/failure';
import { Locale } from '../../domain/locale';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { BadRequestError, InternalError } from '../service/error-types';
import { Result } from '../../common/result/types';
import { AssertionException } from '../../common/exeptions';
import { DTO } from '../../domain/dto';
import { ModuleResolver } from './module-resolver';
import { ModuleResolves } from './module-resolves';

export abstract class Module<JWT_P extends DTO> {
  readonly abstract moduleType: ModuleType;

  readonly abstract moduleName: string;

  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  readonly abstract eventServices: GeneralEventService[];

  protected moduleResolver!: GeneralModuleResolver;

  protected services!: Service[];

  protected logger!: Logger;

  init(
    moduleResolver: ModuleResolver<JWT_P, Module<JWT_P>, ModuleResolves<Module<JWT_P>>>,
    serverResolver: ServerResolver<JWT_P>,
  ): void {
    this.moduleResolver = moduleResolver;
    moduleResolver.init(this, serverResolver);
    this.logger = moduleResolver.getLogger();
    this.logger.info(`  | resolver for module ${this.moduleName} inited successfully`);

    this.services = [...this.queryServices, ...this.commandServices, ...this.eventServices];
    this.services.forEach((service) => service.init(moduleResolver));
  }

  stop(): void {
    this.moduleResolver.stop();
  }

  getModuleResolver(): GeneralModuleResolver {
    return this.moduleResolver;
  }

  getLogger(): Logger {
    return this.logger;
  }

  async executeService<S extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
    requestDod: S['input'],
    caller: Caller,
  ): Promise<ServiceResult<S>> {
    try {
      const serviceName = requestDod.meta.name;
      const service = this.getServiceByName(serviceName);
      if (service === undefined) {
        return this.notFindedServiceByName(serviceName);
      }

      const store: StorePayload = {
        caller,
        moduleResolver: this.moduleResolver,
        requestId: requestDod.meta.requestId,
        databaseErrorRestartAttempts: 1,
      };
      const threadStore = storeDispatcher.getThreadStore();
      return threadStore.run(
        store,
        (serviceInput) => service.execute(serviceInput),
        requestDod,
      ) as unknown as ServiceResult<S>;
    } catch (e) {
      if (this.moduleResolver.getRunMode().includes('test')) {
        throw e;
      }
      this.moduleResolver.getLogger().fatalError('server internal error', { requestDod, caller }, e as Error);
      const err = dodUtility.getAppError<InternalError<Locale<'Internal error'>>>(
        'Internal error',
        'Извините, на сервере произошла ошибка',
        {},
      );
      return failure(err);
    }
  }

  async executeEventService(eventDod: GeneralEventDod): Promise<void> {
    try {
      const serviceName = eventDod.meta.name;
      const service = this.getServiceByName(serviceName);
      if (!service) {
        const errStr = `not finded service by name: ${serviceName} in module: ${this.moduleName}`;
        throw new AssertionException(errStr);
      }
      const caller = eventDod.caller.type === 'ModuleCaller'
        ? eventDod.caller.user
        : eventDod.caller;
      const store: StorePayload = {
        caller,
        moduleResolver: this.moduleResolver,
        requestId: eventDod.meta.requestId,
        databaseErrorRestartAttempts: 1,
      };
      const threadStore = storeDispatcher.getThreadStore();
      await threadStore.run(
        store,
        (serviceInput) => service.execute(serviceInput),
        eventDod,
      );
    } catch (e) {
      if (this.moduleResolver.getRunMode() === 'test') {
        this.moduleResolver.getServerResolver().getServer().stop();
        throw e;
      }
      throw this.moduleResolver.getLogger().fatalError('server internal error', eventDod, e as Error);
    }
  }

  getServiceByName<S extends Service = Service>(name: S['serviceName']): S {
    return this.services.find((s) => s.serviceName === name) as S;
  }

  protected notFindedServiceByName(reqName: string): Result<BadRequestError<Locale<'Bad request'>>, never> {
    const err = dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
      'Bad request',
      `Не найден обработчик для запроса ${reqName} в модуле ${this.moduleName}`,
      {},
    );
    return failure(err);
  }
}
