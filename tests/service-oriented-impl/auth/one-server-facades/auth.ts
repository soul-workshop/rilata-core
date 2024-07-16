import { DomainUser, ModuleCaller } from '../../../../src/api/controller/types.js';
import { GeneralModuleResolver } from '../../../../src/api/module/types.js';
import { FullServiceResult } from '../../../../src/api/service/types.js';
import { UserId } from '../../../../src/core/types.js';
import { dodUtility } from '../../../../src/core/utils/dod/dod-utility.js';
import { AuthFacade } from '../facade.js';
import { AuthModule } from '../module.js';
import { AddUserRequestDod } from '../services/user/add-user/s-params.js';
import { AddingUserService } from '../services/user/add-user/service.js';
import { GetUsersRequestDod } from '../services/user/get-users/s-params.js';
import { GetingUsersService } from '../services/user/get-users/service.js';

/** Реализация фасада для работы в рамках одного сервера */
export class AuthFacadeOneServerImpl implements AuthFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  addUser(iin: string, caller: DomainUser): Promise<FullServiceResult<AddingUserService>> {
    const requestDod = dodUtility.getRequestDod<AddUserRequestDod>('addUser', { personIin: iin });
    const mCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<AuthModule>('AuthModule')
      .executeService(requestDod, mCaller) as Promise<FullServiceResult<AddingUserService>>;
  }

  async getUsers(
    userIds: UserId[], caller: DomainUser,
  ): Promise<FullServiceResult<GetingUsersService>> {
    const requestDod = dodUtility.getRequestDod<GetUsersRequestDod>('getUsers', { userIds });
    const mCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<AuthModule>('AuthModule')
      .executeService(requestDod, mCaller) as Promise<FullServiceResult<GetingUsersService>>;
  }
}
