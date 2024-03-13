import { Repositoriable } from '../../../../../src/app/resolves/repositoriable';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { SubjectModuleResolver } from '../../resolver';
import { PersonAR } from './a-root';
import { PersonDoesntExistByIdError, PersonDoesntExistByIinError, PersonAlreadyExistsError } from './repo-errors';

export interface PersonRepository {
  init(resolver: SubjectModuleResolver): void
  addPerson(person: PersonAR): Promise<Result<PersonAlreadyExistsError, { id: UuidType }>>
  getById(id: string): Promise<Result<PersonDoesntExistByIdError, PersonAR>>
  getByIin(iin: string): Promise<Result<PersonDoesntExistByIinError, PersonAR>>
}

export const PersonRepository = {
  instance(resolver: Repositoriable): PersonRepository {
    return resolver.getRepository(PersonRepository) as PersonRepository;
  },
};
