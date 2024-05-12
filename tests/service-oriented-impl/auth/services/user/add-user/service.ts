import { CommandService } from '../../../../../../src/app/service/concrete-service/command.service';
import { UowTransactionStrategy } from '../../../../../../src/app/service/transaction-strategy/uow.strategy';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { uuidUtility } from '../../../../../../src/common/utils/uuid/uuid-utility';
import { UserRepository, UserRepositoryRecord } from '../../../domain-object/user/repo';
import { AuthModuleResolver } from '../../../resolver';
import { AddUserRequestDod, AddUserServiceParams } from './s-params';
import { addUserValidator } from './v-map';

export class AddingUserService extends CommandService<
  AddUserServiceParams, AuthModuleResolver
> {
  moduleName = 'AuthModule' as const;

  serviceName = 'AddingUserService' as const;

  inputDodName = 'addUser' as const;

  aRootName = 'UserAR' as const;

  protected transactionStrategy = new UowTransactionStrategy(true);

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = addUserValidator;

  async runDomain(
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
