import { Caller, DomainUser } from '../../../src/api/controller/types';
import { GeneralModuleResolver } from '../../../src/api/module/types';
import { Facadable } from '../../../src/api/resolve/facadable';
import { ServiceResult } from '../../../src/api/service/types';
import { AddPersonRequestDodAttrs, AddPersonServiceParams } from './services/person/add-person/s-params';
import { GetPersonByIinServiceParams } from './services/person/get-by-iin/s-params';

export interface SubjectFacade {
  init(resolver: GeneralModuleResolver): void
  getPersonByIin(iin: string, caller: Caller): Promise<ServiceResult<GetPersonByIinServiceParams>>
  addPerson(
    input: AddPersonRequestDodAttrs, caller: DomainUser
  ): Promise<ServiceResult<AddPersonServiceParams>>
}

export const SubjectFacade = {
  instance(resolver: Facadable): SubjectFacade {
    return resolver.resolveFacade(SubjectFacade) as SubjectFacade;
  },
};
