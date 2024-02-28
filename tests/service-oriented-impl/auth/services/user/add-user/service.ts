import { CommandService } from '../../../../../../src/app/service/command-service';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { dodUtility } from '../../../../../../src/common/utils/domain-object/dod-utility';
import { uuidUtility } from '../../../../../../src/common/utils/uuid/uuid-utility';
import { UserRepository, UserRepositoryRecord } from '../../../domain-object/user/repo';
import { AddUserRequestDod, AddUserServiceParams, UserAddedEvent } from './s-params';
import { addUserValidator } from './v-map';

export class AddingUserService extends CommandService<AddUserServiceParams> {
  serviceName = 'addUser' as const;

  protected aRootName = 'UserAR' as const;

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
    const event = dodUtility.getEvent<UserAddedEvent>(
      'UserAddedEvent',
      input.attrs,
      {
        attrs: { userId: userRecord.userId, personIin: userRecord.personIin },
        meta: { name: 'UserAR', domainType: 'aggregate', version: 0 },
      },
    );
    const eventRepo = this.moduleResolver.getEventRepository();
    await eventRepo.addEvent(event, userRecord.userId);
    const userRepo = UserRepository.instance(this.moduleResolver);
    return userRepo.addUser(userRecord);
  }
}
