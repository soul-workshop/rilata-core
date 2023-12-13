import { CommandUseCase } from '../../../../../src/app/use-case/command-use-case';
import { GetUcOptions, GetUcResult } from '../../../../../src/app/use-case/types';
import { AddingPersonUCParams } from './params';
import { addPersonVMap } from './v-map';

export class AddingPersonUC extends CommandUseCase<AddingPersonUCParams> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap = addPersonVMap;

  actionType = 'class' as const;

  aggregateName = 'PersonAR' as const;

  actionName = 'addPerson' as const;

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
