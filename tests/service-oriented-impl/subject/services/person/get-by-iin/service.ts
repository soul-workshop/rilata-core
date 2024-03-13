import { QueryService } from '../../../../../../src/app/service/query-service';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { failure } from '../../../../../../src/common/result/failure';
import { success } from '../../../../../../src/common/result/success';
import { PersonRepository } from '../../../domain-object/person/repo';
import { GetPersonByIinRequestDod, GetPersonByIinServiceParams } from './s-params';
import { getPersonByIinValidator } from './v-map';

export class GetingPersonByIinService extends QueryService<GetPersonByIinServiceParams> {
  serviceName = 'getPersonByIin' as const;

  aRootName = 'PersonAR' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = getPersonByIinValidator;

  protected async runDomain(
    input: GetPersonByIinRequestDod,
  ): Promise<ServiceResult<GetPersonByIinServiceParams>> {
    const personRepo = PersonRepository.instance(this.moduleResolver);
    const result = await personRepo.getByIin(input.attrs.iin);
    if (result.isFailure()) return failure(result.value);
    return success(result.value.getHelper().getOutput().attrs);
  }
}
