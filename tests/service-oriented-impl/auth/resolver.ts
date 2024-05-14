/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolver } from '../../../src/app/module/m-resolver';
import { GeneralServerResolver } from '../../../src/app/server/types';
import { UserRepository } from './domain-object/user/repo';
import { AuthResolves } from './resolves';

export class AuthModuleResolver extends ModuleResolver<
  GeneralServerResolver, AuthResolves
> {
  resolve(key: unknown): unknown {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): unknown {
    if (key === UserRepository) return this.resolves.userRepo;
    if (key === EventRepository) {
      return this.resolves.eventRepo;
    }
    throw this.getLogger().error(`not finded repository in key: ${key}`);
  }

  resolveFacade(key: unknown): unknown {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
