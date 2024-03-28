/* eslint-disable @typescript-eslint/no-unused-vars */
import { BusMessageRepository } from '../../../src/app/database/bus-message-repository';
import { EventRepository } from '../../../src/app/database/event-repository';
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { UserRepository } from './domain-object/user/repo';
import { AuthModule } from './module';
import { AuthResolves } from './resolves';
import { UserJwtPayload } from './services/user/user-authentification/s-params';

export class AuthModuleResolver extends ModuleResolver<
  UserJwtPayload, AuthModule, AuthResolves
> {
  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === UserRepository) return this.resolves.userRepo;
    if (key === EventRepository || key === BusMessageRepository) {
      return this.resolves.busMessageRepo;
    }
    throw this.getLogger().error(`not finded repository in key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
