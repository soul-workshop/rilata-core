import { UuidType } from '../../common/types';
import { Caller } from '../caller';
import { GeneralModuleResolver } from '../module/types';

export type StorePayload = {
  serviceName: string,
  moduleName: string,
  caller: Caller,
  moduleResolver: GeneralModuleResolver,
  databaseErrorRestartAttempts: number;
  requestId: UuidType,
  unitOfWorkId?: UuidType, // доступна только после commandService.execute();
}

export type ThreadStore<T extends StorePayload> = {
  run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F,

  getStore(): T | undefined;
}
