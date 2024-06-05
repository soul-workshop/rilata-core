import { DomainUser, ModuleCaller } from '../../../../src/api/controller/types';
import { GeneralModuleResolver } from '../../../../src/api/module/types';
import { FullServiceResult } from '../../../../src/api/service/types';
import { UserId } from '../../../../src/core/types';
import { dodUtility } from '../../../../src/core/utils/dod/dod-utility';
import { AuthFacade } from '../facade';
import { AuthModule } from '../module';
import { AddUserRequestDod, AddUserServiceParams } from '../services/user/add-user/s-params';
import { GetUsersRequestDod, GetUsersServiceParams } from '../services/user/get-users/s-params';

/** Реализация фасада для работы в рамках одного сервера */
export class AuthFacadeOneServerImpl implements AuthFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  addUser(iin: string, caller: DomainUser): Promise<FullServiceResult<AddUserServiceParams>> {
    const requestDod = dodUtility.getRequestDod<AddUserRequestDod>('addUser', { personIin: iin });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<AuthModule>('AuthModule')
      .executeService(requestDod, moduleCaller);
  }

  async getUsers(
    userIds: UserId[], caller: DomainUser,
  ): Promise<FullServiceResult<GetUsersServiceParams>> {
    const requestDod = dodUtility.getRequestDod<GetUsersRequestDod>('getUsers', { userIds });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<AuthModule>('AuthModule')
      .executeService(requestDod, moduleCaller);
  }
}
