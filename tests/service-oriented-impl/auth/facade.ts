import { DomainUser } from '../../../src/app/caller';
import { GeneralModuleResolver } from '../../../src/app/module/types';
import { Facadable } from '../../../src/app/resolves/facadable';
import { ServiceResult } from '../../../src/app/service/types';
import { UuidType } from '../../../src/common/types';
import { AddUserServiceParams } from './services/user/add-user/s-params';
import { GetUsersServiceParams } from './services/user/get-users/s-params';

export interface AuthFacade {
  init(resolver: GeneralModuleResolver): void
  addUser(personIin: string, caller: DomainUser): Promise<ServiceResult<AddUserServiceParams>>
  getUsers(userIds: UuidType[], caller: DomainUser): Promise<ServiceResult<GetUsersServiceParams>>
}

export const AuthFacade = {
  instance(resolver: Facadable): AuthFacade {
    return resolver.resolveFacade(AuthFacade) as AuthFacade;
  },
};
