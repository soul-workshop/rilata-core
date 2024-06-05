import { DomainUser } from '../../../src/api/controller/types';
import { GeneralModuleResolver } from '../../../src/api/module/types';
import { Facadable } from '../../../src/api/resolve/facadable';
import { FullServiceResult } from '../../../src/api/service/types';
import { UuidType } from '../../../src/core/types';
import { AddUserServiceParams } from './services/user/add-user/s-params';
import { GetUsersServiceParams } from './services/user/get-users/s-params';

export interface AuthFacade {
  init(resolver: GeneralModuleResolver): void
  addUser(personIin: string, caller: DomainUser): Promise<FullServiceResult<AddUserServiceParams>>
  // eslint-disable-next-line max-len
  getUsers(userIds: UuidType[], caller: DomainUser): Promise<FullServiceResult<GetUsersServiceParams>>
}

export const AuthFacade = {
  instance(resolver: Facadable): AuthFacade {
    return resolver.resolveFacade(AuthFacade) as AuthFacade;
  },
};
