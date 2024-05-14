/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolver } from '../../../src/app/module/m-resolver';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { GeneralServerResolver } from '../../../src/app/server/types';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectResolves } from './resolves';

export class SubjectModuleResolver extends ModuleResolver<
  GeneralServerResolver, SubjectResolves
> {
  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === PersonRepository) return this.resolves.personRepo;
    if (key === EventRepository) {
      return this.resolves.eventRepo;
    }
    throw Error(`not found repository by key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
