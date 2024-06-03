/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventRepository } from '../../../src/api/database/event.repository';
import { ModuleResolver } from '../../../src/api/module/m-resolver';
import { GeneralServerResolver } from '../../../src/api/server/types';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectResolves } from './resolves';

export class SubjectModuleResolver extends ModuleResolver<
  GeneralServerResolver, SubjectResolves
> {
  resolve(key: unknown): unknown {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): unknown {
    if (key === PersonRepository) return this.resolves.personRepo;
    if (key === EventRepository) {
      return this.resolves.eventRepo;
    }
    throw Error(`not found repository by key: ${key}`);
  }

  resolveFacade(key: unknown): unknown {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
