import { UseCaseParams } from '../../../../../../src/app/use-case/types';
import { CommandDod, ErrorDod, EventDod } from '../../../../../../src/domain/domain-object-data/types';
import { PersonAttrs } from '../../object-data/person-params';

export type AddingPersonUCParams = UseCaseParams<
  AddingPersonCommand,
  string, // id,
  PersonExistsError,
  PersonAddedEvent[]
>;
