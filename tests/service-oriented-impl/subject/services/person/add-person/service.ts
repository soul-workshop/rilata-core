import { CommandService } from '../../../../../../src/api/service/concrete-service/command.service';
import { UowTransactionStrategy } from '../../../../../../src/api/service/transaction-strategy/uow.strategy';
import { ServiceResult } from '../../../../../../src/api/service/types';
import { PersonFactory } from '../../../domain-object/person/factory';
import { PersonRepository } from '../../../domain-object/person/repo';
import { SubjectModuleResolver } from '../../../resolver';
import { AddPersonRequestDod, AddPersonServiceParams } from './s-params';
import { addPersonValidator } from './v-map';

export class AddingPersonService extends CommandService<
  AddPersonServiceParams, SubjectModuleResolver
> {
  moduleName = 'SubjectModule' as const;

  serviceName = 'AddingPersonService' as const;

  inputDodName = 'addPerson' as const;

  aRootName = 'PersonAR' as const;

  protected supportedCallers = ['ModuleCaller', 'DomainUser'] as const;

  protected transactionStrategy = new UowTransactionStrategy(true);

  protected validator = addPersonValidator;

  async runDomain(
    input: AddPersonRequestDod,
  ): Promise<ServiceResult<AddPersonServiceParams>> {
    const factory = new PersonFactory();
    const person = factory.create(input.attrs);
    const repo = PersonRepository.instance(this.moduleResolver);
    return repo.addPerson(person);
  }
}
