import { CommandService } from '../../../../../../src/app/service/command-service';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { uuidUtility } from '../../../../../../src/common/utils/uuid/uuid-utility';
import { UserRepository, UserRepositoryRecord } from '../../../domain-object/user/repo';
import { AddUserRequestDod, AddUserServiceParams } from './s-params';
import { addUserValidator } from './v-map';

export class AddingUserService extends CommandService<AddUserServiceParams> {
  serviceName = 'addUser' as const;

  aRootName = 'UserAR' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = addUserValidator;

  protected async runDomain(
    input: AddUserRequestDod,
  ): Promise<ServiceResult<AddUserServiceParams>> {
    const userRecord: UserRepositoryRecord = {
      userId: uuidUtility.getNewUUID(),
      personIin: input.attrs.personIin,
      version: 0,
    };
    const userRepo = UserRepository.instance(this.moduleResolver);
    return userRepo.addUser(userRecord);
  }
}
