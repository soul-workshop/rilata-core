/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandService } from '../../../../../src/app/service/command-service';
import { ServiceResult } from '../../../../../src/app/service/types';
import { AddingPersonServiceParams } from './s-params';
import { addPersonValidator } from './v-map';

export class AddingPersonService extends CommandService<AddingPersonServiceParams> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap = addPersonValidator;

  aRootName = 'PersonAR' as const;

  name = 'addPerson' as const;

  protected runDomain(
    actionDod: AddingPersonServiceParams['actionDod'],
  ): Promise<ServiceResult<AddingPersonServiceParams>> {
    throw new Error('Method not implemented.');
  }

  protected checkPersmissions(
    actionDod: AddingPersonServiceParams['actionDod'],
  ): Promise<ServiceResult<AddingPersonServiceParams>> {
    throw new Error('Method not implemented.');
  }
}
