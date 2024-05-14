import { DomainUser, ModuleCaller } from '../../../../src/app/controller/types';
import { GeneralModuleResolver } from '../../../../src/app/module/types';
import { ServiceResult } from '../../../../src/app/service/types';
import { UserId } from '../../../../src/common/types';
import { dodUtility } from '../../../../src/common/utils/dod/dod-utility';
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

  addUser(iin: string, caller: DomainUser): Promise<ServiceResult<AddUserServiceParams>> {
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
  ): Promise<ServiceResult<GetUsersServiceParams>> {
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
