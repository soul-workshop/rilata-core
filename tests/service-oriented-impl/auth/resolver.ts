/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { UserRepository } from './domain-object/user/repo';
import { AuthModule } from './module';
import { AuthResolves } from './resolves';

export class AuthModuleResolver extends ModuleResolver<AuthModule, AuthResolves> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/auth-module/',
  };

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === UserRepository) return this.resolves.userRepo;
    throw this.getLogger().error(`not finded repository in key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }
}