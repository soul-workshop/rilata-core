import { ClassActionable } from '../../../../src/app/use-case/actionable/class-actionable';
import { CommandUseCase } from '../../../../src/app/use-case/command-use-case';
import { GetUcOptions, GetUcResult } from '../../../../src/app/use-case/types';
import { StrictEqualFieldValidator } from '../../../../src/domain/validator/field-validator/prepared-fields/string/strict-equal';
import { CommandValidatorMap } from '../../../../src/domain/validator/field-validator/types';
import { PersonParams } from '../../domain-data/person/params';
import { personAttrsVMap } from '../../domain-data/person/v-map';
import { AddingPersonUCCommand, AddingPersonUCParams } from './params';

export class AddingPersonUC extends CommandUseCase<AddingPersonUCParams>
  implements ClassActionable<PersonParams, 'addPerson'> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap: CommandValidatorMap<AddingPersonUCCommand> = {
    attrs: {
      govPersonId: personAttrsVMap.govPersonId,
      name: personAttrsVMap.name,
      lastName: personAttrsVMap.lastName,
      patronomic: personAttrsVMap.patronomic,
    },
    name: new StrictEqualFieldValidator('AddingPersonCommand'),
  };

  actionType: 'class' = 'class';

  aggregateName: 'PersonAR' = 'PersonAR';

  actionName: 'addPerson' = 'addPerson';

  getAction(userId: string): Promise<Record<'addPerson', boolean>> {
    throw new Error('Method not implemented.');
  }

  protected runDomain(
    options: GetUcOptions<AddingPersonUCParams>,
  ): Promise<GetUcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }

  protected checkPersmissions(
    options: GetUcOptions<AddingPersonUCParams>,
  ): Promise<GetUcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }
}
