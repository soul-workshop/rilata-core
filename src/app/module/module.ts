/* eslint-disable no-use-before-define */
import { Logger } from '../../common/logger/logger';
import {
  GeneralCommandService,
  GeneralCommandServiceParams, GeneralEventService,
  GeneralQueryServiceParams, GeneraQueryService, ServiceResult,
} from '../service/types';
import { Service } from '../service/service';
import { GeneralModuleResolver, ModuleType } from './types';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { StorePayload } from '../async-store/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { failure } from '../../common/result/failure';
import { Locale } from '../../domain/locale';
import { BadRequestError, InternalError } from '../service/error-types';
import { Result } from '../../common/result/types';
import { AssertionException } from '../../common/exeptions';
import { GeneralServerResolver } from '../server/types';
import { Caller } from '../controller/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';
import { BaseUrlModuleController } from '../controller/base-url-m-controller';
import { Controller } from '../controller/controller';

export abstract class Module {
  readonly abstract moduleName: string;

  readonly abstract moduleType: ModuleType;

  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  readonly abstract eventServices: GeneralEventService[];

  protected controllers: Controller<GeneralModuleResolver>[] = [];

  protected moduleResolver!: GeneralModuleResolver;

  protected services!: Service<GeneralModuleResolver>[];

  protected logger!: Logger;

  init(
    moduleResolver: GeneralModuleResolver,
    serverResolver: GeneralServerResolver,
  ): void {
    this.moduleResolver = moduleResolver;
    moduleResolver.init(this, serverResolver);
    this.logger = moduleResolver.getLogger();
    this.logger.info(`  | resolver for module ${this.moduleName} inited successfully`);

    this.controllers.push(this.getBaseUrlModuleController());
    this.controllers.forEach((controller) => { controller.init(this.moduleResolver); });

    this.services = [...this.queryServices, ...this.commandServices, ...this.eventServices];
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

  getModuleControllers(): Controller<GeneralModuleResolver>[] {
    return this.controllers;
  }

  async executeService<S extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
    inputDod: S['input'],
    caller: Caller,
  ): Promise<ServiceResult<S>> {
    try {
      const inputDodName = inputDod.meta.name;
      const service = this.getServiceByInputDodName(inputDodName);
      if (service === undefined) {
        return this.notFindedServiceByName(inputDodName);
      }

      const store: StorePayload = {
        serviceName: inputDodName,
        moduleName: this.moduleName,
        caller,
        moduleResolver: this.moduleResolver,
        requestId: inputDod.meta.requestId,
        databaseErrorRestartAttempts: 1,
      };
      const threadStore = storeDispatcher.getThreadStore();
      return threadStore.run(
        store,
        (serviceInput) => service.execute(serviceInput),
        inputDod,
      ) as unknown as ServiceResult<S>;
    } catch (e) {
      if (this.moduleResolver.getServerResolver().getRunMode().includes('test')) {
        throw e;
      }
      this.moduleResolver.getLogger().fatalError('server internal error', { requestDod: inputDod, caller }, e as Error);
      const err = dodUtility.getAppError<InternalError<Locale<'Internal error'>>>(
        'Internal error',
        'Извините, на сервере произошла ошибка',
        {},
      );
      return failure(err);
    }
  }

  protected getBaseUrlModuleController(): BaseUrlModuleController {
    return new BaseUrlModuleController();
  }

  async executeEventService(eventDod: GeneralEventDod): Promise<void> {
    try {
      const serviceName = eventDod.meta.name;
      const service = this.getServiceByInputDodName(serviceName);
      if (!service) {
        const errStr = `not finded service by name: ${serviceName} in module: ${this.moduleName}`;
        throw new AssertionException(errStr);
      }
      const caller = eventDod.caller.type === 'ModuleCaller'
        ? eventDod.caller.user
        : eventDod.caller;
      const store: StorePayload = {
        serviceName,
        moduleName: this.moduleName,
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
      if (this.moduleResolver.getServerResolver().getRunMode() === 'test') {
        this.moduleResolver.getServerResolver().getServer().stop();
        throw e;
      }
      throw this.moduleResolver.getLogger().fatalError('server internal error', eventDod, e as Error);
    }
  }

  getServiceByInputDodName<S extends Service<GeneralModuleResolver>>(name: S['inputDodName']): S {
    return this.services.find((s) => s.inputDodName === name) as S;
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
