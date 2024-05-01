/* eslint-disable @typescript-eslint/no-unused-vars */
import { BusMessageRepository } from '../../../src/app/database/bus-message-repository';
import { EventRepository } from '../../../src/app/database/event-repository';
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectModule } from './module';
import { SubjectResolves } from './resolves';

export class SubjectModuleResolver extends ModuleResolver<
  UserJwtPayload, SubjectModule, SubjectResolves
> {
  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === PersonRepository) return this.resolves.personRepo;
    if (key === EventRepository || key === BusMessageRepository) {
      return this.resolves.eventRepo;
    }
    throw Error(`not found repository by key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
