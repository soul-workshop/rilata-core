import { CommandUseCase } from '../../../../../src/app/use-case/command-use-case';
import { GetUcOptions, UcResult } from '../../../../../src/app/use-case/types';
import { AddingPersonUCParams } from './params';
import { addPersonValidator } from './v-map';

export class AddingPersonUC extends CommandUseCase<AddingPersonUCParams> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap = addPersonValidator;

  actionType = 'class' as const;

  aRootName = 'PersonAR' as const;

  name = 'addPerson' as const;

  protected runDomain(
    options: GetUcOptions<AddingPersonUCParams>,
  ): Promise<UcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }

  protected checkPersmissions(
    options: GetUcOptions<AddingPersonUCParams>,
  ): Promise<UcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }
}
