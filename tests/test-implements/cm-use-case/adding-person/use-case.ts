import { CommandUseCase } from '../../../../../../src/app/use-case/command-use-case';
import { AddingPersonOptions, AddingPersonResult, AddingPersonUCParams } from './use-case-params';
import { addingPersonCommandVMap } from './validator-map';

export class AddingPersonUC extends CommandUseCase<AddingPersonUCParams> {
  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap = addingPersonCommandVMap;

  protected runDomain(options: AddingPersonOptions): Promise<AddingPersonResult> {
    throw Error('not implemented');
  }
}
