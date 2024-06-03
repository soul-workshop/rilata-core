import { QueryService } from '../../../../../../src/api/service/concrete-service/query.service';
import { ServiceResult } from '../../../../../../src/api/service/types';
import { failure } from '../../../../../../src/core/result/failure';
import { success } from '../../../../../../src/core/result/success';
import { PersonRepository } from '../../../domain-object/person/repo';
import { SubjectModuleResolver } from '../../../resolver';
import { GetPersonByIinRequestDod, GetPersonByIinServiceParams } from './s-params';
import { getPersonByIinValidator } from './v-map';

export class GetingPersonByIinService extends QueryService<
  GetPersonByIinServiceParams, SubjectModuleResolver
> {
  moduleName = 'SubjectModule' as const;

  serviceName = 'GetingPersonByIinService' as const;

  inputDodName = 'getPersonByIin' as const;

  aRootName = 'PersonAR' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = getPersonByIinValidator;

  async runDomain(
    input: GetPersonByIinRequestDod,
  ): Promise<ServiceResult<GetPersonByIinServiceParams>> {
    const personRepo = PersonRepository.instance(this.moduleResolver);
    const result = await personRepo.getByIin(input.attrs.iin);
    if (result.isFailure()) return failure(result.value);
    return success(result.value.getHelper().getOutput().attrs);
  }
}
