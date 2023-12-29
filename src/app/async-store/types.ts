import { UuidType } from '../../common/types';
import { Caller } from '../caller';
import { ModuleResolver } from '../resolves/module-resolver';

export type StorePayload = {
  caller: Caller,
  moduleResolver: ModuleResolver,
  actionId: UuidType,
  unitOfWorkId?: UuidType, // доступна только после commandService.execute();
}

export type ThreadStore<T extends StorePayload> = {
  run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F,

  getStore(): T | undefined;
}
