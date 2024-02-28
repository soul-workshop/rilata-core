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
import { GeneralErrorDod, GeneralRequestDod } from '../../domain/domain-data/domain-types';
import { failure } from '../../common/result/failure';
import { Locale } from '../../domain/locale';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { BadRequestError, InternalError, ServiceBaseErrors } from '../service/error-types';
import { ResultDTO } from '../result-dto';
import { Result } from '../../common/result/types';

export abstract class Module {
  readonly abstract moduleType: ModuleType;

  readonly abstract moduleName: string;

  readonly abstract queryServices: GeneraQueryService[]

  readonly abstract commandServices: GeneralCommandService[];

  readonly abstract eventServices: GeneralEventService[];

  protected moduleResolver!: GeneralModuleResolver;

  protected services!: Service[];

  protected logger!: Logger;

  init(moduleResolver: GeneralModuleResolver, serverResolver: ServerResolver): void {
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

  getServiceByName<S extends Service = Service>(name: S['serviceName']): S {
    return this.services.find((s) => s.serviceName === name) as S;
  }

  getModuleResolver(): GeneralModuleResolver {
    return this.moduleResolver;
  }

  getLogger(): Logger {
    return this.logger;
  }

  async executeService<S extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
    requestDod: GeneralRequestDod,
    caller: Caller,
  ): Promise<ServiceResult<S>> {
    try {
      const reqName = requestDod.meta.name;
      const service = this.getServiceByName(reqName);
      if (service === undefined) {
        return this.notFindedServiceByName(reqName);
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

  protected notFindedServiceByName(reqName: string): Result<BadRequestError<Locale<'Bad request'>>, never> {
    const err = dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
      'Bad request',
      `Не найден обработчик для запроса ${reqName} в модуле ${this.moduleName}`,
      {},
    );
    return failure(err);
  }
}
