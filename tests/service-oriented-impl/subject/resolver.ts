/* eslint-disable @typescript-eslint/no-unused-vars */
import { BusMessageRepository } from '../../../src/app/database/bus-message-repository';
import { EventRepository } from '../../../src/app/database/event-repository';
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectModule } from './module';
import { SubjectResolves } from './resolves';

export class SubjectModuleResolver extends ModuleResolver<
  UserJwtPayload, SubjectModule, SubjectResolves
> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/subject-module/',
  };

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === PersonRepository) return this.resolves.personRepo;
    if (key === EventRepository || key === BusMessageRepository) {
      return this.resolves.busMessageRepo;
    }
    throw Error(`not found repository by key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
