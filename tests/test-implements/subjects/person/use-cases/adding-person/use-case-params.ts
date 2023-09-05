import { UseCaseParams } from '../../../../../../src/app/use-case/types';
import { CommandDod } from '../../../../../../src/domain/domain-object-data/types';
import { PersonAttrs } from '../../object-data/person-params';

export type AddingPersonCommand = CommandDod<PersonAttrs, 'AddingPersonCommand', 'usecase-command'>;

export type AddingPersonUCParams = UseCaseParams<

>;
