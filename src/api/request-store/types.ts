import { Logger } from '../../core/logger/logger';
import { UuidType } from '../../core/types';
import { Caller } from '../controller/types';
import { GeneralModuleResolver } from '../module/types';

export type RequestStorePayload = {
  serviceName: string,
  moduleName: string,
  logger: Logger,
  caller: Caller,
  moduleResolver: GeneralModuleResolver,
  databaseErrorRestartAttempts: number;
  requestId: UuidType,
  unitOfWorkId?: UuidType, // доступна только после commandService.execute();
}

export type RequestStore<T extends RequestStorePayload> = {
  run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F,

  /** Возвращает RequestStorePayload. Название метода привязано к AsyncLocalStorage API. */
  getStore(): T | undefined;
}
