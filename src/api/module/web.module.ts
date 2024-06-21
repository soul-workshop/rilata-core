/* eslint-disable no-use-before-define */
import {
  GeneralCommandService, GeneralEventService,
  GeneralWebService, GeneraQueryService,
} from '../service/types.js';
import { Service } from '../service/service.js';
import { GeneralModuleResolver } from './types.js';
import { GeneralRequestDod, InputDod } from '../../domain/domain-data/domain-types.js';
import { failure } from '../../core/result/failure.js';
import { GeneralServerResolver } from '../server/types.js';
import { Caller } from '../controller/types.js';
import { RequestStorePayload } from '../request-store/types.js';
import { requestStoreDispatcher } from '../request-store/request-store-dispatcher.js';
import { Module } from './module.js';
import { Result } from '#core/result/types.js';
import { badRequestError, internalError } from '#api/base.index.js';

export abstract class WebModule extends Module {
  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  readonly abstract eventServices: GeneralEventService[];

  protected services!: GeneralWebService[];

  init(
    moduleResolver: GeneralModuleResolver,
    serverResolver: GeneralServerResolver,
  ): void {
    super.init(moduleResolver, serverResolver);
    this.services = [...this.queryServices, ...this.commandServices, ...this.eventServices];
  }

  async executeService(
    inputDod: InputDod,
    caller: Caller,
  ): Promise<Result<unknown, unknown>> {
    try {
      const findServiceResult = this.findHandlerService(inputDod);
      if (findServiceResult.isFailure()) {
        return findServiceResult;
      }
      const service = findServiceResult.value;

      const requestStore = requestStoreDispatcher.getRequestStore();
      return requestStore.run(
        this.getStorePayload(inputDod, caller),
        (serviceInput) => service.execute(serviceInput),
        inputDod,
      );
    } catch (e) {
      if (this.moduleResolver.getServerResolver().getRunMode().includes('test')) {
        throw e;
      }
      if (this.isRequestDod(inputDod)) {
        this.moduleResolver.getLogger().fatalError(
          'server internal error',
          { requestDod: inputDod, caller },
          e as Error,
        );
        return failure(internalError);
      }

      // event dod
      if (this.moduleResolver.getServerResolver().getRunMode() === 'test') {
        this.moduleResolver.getServerResolver().getServer().stop();
        throw e;
      }
      throw this.moduleResolver.getLogger().fatalError('server internal error', inputDod, e as Error);
    }
  }

  protected findHandlerService(inputDod: InputDod): Result<
    typeof badRequestError,
    Service<GeneralModuleResolver>
  > {
    const inputDodName = inputDod.meta.name;
    const service = this.services.find((s) => s.inputDodName === inputDodName);
    if (!service) {
      const errStr = `Не найден обработчик для запроса ${inputDodName} в модуле ${this.moduleName}`;
      if (this.isRequestDod(inputDod)) {
        return this.notFindedServiceError(errStr);
      }
      // event service throwed
      throw this.logger.error(errStr);
    }
    return service;
  }

  protected getStorePayload(inputDod: InputDod, caller: Caller): RequestStorePayload {
    return {
      serviceName: inputDod.meta.name,
      moduleName: this.moduleName,
      caller,
      moduleResolver: this.moduleResolver,
      logger: this.logger,
      requestId: inputDod.meta.requestId,
      databaseErrorRestartAttempts: 1,
    };
  }

  protected isRequestDod(inputDod: InputDod): inputDod is GeneralRequestDod {
    return inputDod.meta.domainType === 'request';
  }
}
