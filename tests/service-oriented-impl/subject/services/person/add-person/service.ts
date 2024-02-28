import { CommandService } from '../../../../../../src/app/service/command-service';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { PersonFactory } from '../../../domain-object/person/factory';
import { PersonRepository } from '../../../domain-object/person/repo';
import { AddPersonRequestDod, AddPersonServiceParams } from './s-params';
import { addPersonValidator } from './v-map';

export class AddingPersonService extends CommandService<AddPersonServiceParams> {
  serviceName = 'addPerson' as const;

  protected aRootName = 'PersonAR' as const;

  protected supportedCallers = ['ModuleCaller', 'DomainUser'] as const;

  protected validator = addPersonValidator;

  protected async runDomain(
    input: AddPersonRequestDod,
  ): Promise<ServiceResult<AddPersonServiceParams>> {
    const factory = new PersonFactory(this.moduleResolver.getLogger());
    const person = factory.create(input.attrs);
    const eventRepo = this.moduleResolver.getEventRepository();
    await Promise.all(person.getHelper().getEvents().map(
      (e) => eventRepo.addEvent(e, person.getId()),
    ));
    const repo = PersonRepository.instance(this.moduleResolver);
    return repo.addPerson(person);
  }
}
