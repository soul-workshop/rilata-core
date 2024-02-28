/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectModule } from './module';
import { SubjectResolves } from './resolves';

export class SubjectModuleResolver extends ModuleResolver<SubjectModule, SubjectResolves> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/subject-module/',
  };

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === PersonRepository) return this.resolves.personRepo;
    throw Error(`not found repository by key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}
