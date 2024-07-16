import { Logger } from '../../core/logger/logger.js';
import { UuidType } from '../../core/types.js';
import { Caller } from '../controller/types.js';
import { GeneralModuleResolver } from '../module/types.js';

export type WebReqeustStorePayload = {
  serviceName: string,
  moduleName: string,
  logger: Logger,
  moduleResolver: GeneralModuleResolver,
  caller: Caller,
  databaseErrorRestartAttempts: number;
  requestId: UuidType,
  unitOfWorkId?: UuidType, // доступна только после commandService.execute();
}

export type BotRequestStorePayload = {
  serviceName: string,
  moduleName: string,
  logger: Logger,
  moduleResolver: GeneralModuleResolver,
  telegramId: number,
}

export type RequestStore<T extends WebReqeustStorePayload> = {
  run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F,

  /** Возвращает RequestStorePayload. Название метода привязано к AsyncLocalStorage API. */
  getStore(): T | undefined;
}
