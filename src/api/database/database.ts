import { GeneralModuleResolver } from '../module/types';

export interface Database {
  init(moduleResolver: GeneralModuleResolver, ...args: unknown[]): void

  stop(): void
}
