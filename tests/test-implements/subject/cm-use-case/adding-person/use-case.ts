/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandUseCase } from '../../../../../src/app/use-case/command-use-case';
import { UcResult } from '../../../../../src/app/use-case/types';
import { AddingPersonUCParams } from './params';
import { addPersonValidator } from './v-map';

export class AddingPersonUC extends CommandUseCase<AddingPersonUCParams> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap = addPersonValidator;

  aRootName = 'PersonAR' as const;

  name = 'addPerson' as const;

  protected runDomain(
    actionDod: AddingPersonUCParams['actionDod'],
  ): Promise<UcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }

  protected checkPersmissions(
    actionDod: AddingPersonUCParams['actionDod'],
  ): Promise<UcResult<AddingPersonUCParams>> {
    throw new Error('Method not implemented.');
  }
}
