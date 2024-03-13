import { QueryService } from '../../../../../src/app/service/query-service';
import { ServiceResult } from '../../../../../src/app/service/types';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { CompanyRepository } from '../../domain-object/company/repo';
import { GetCompanyRequestDod, GetCompanyServiceParams } from './s.params';
import { getCompanyValidator } from './v-map';

export class GetingCompanyService extends QueryService<GetCompanyServiceParams> {
  serviceName = 'getCompany' as const;

  aRootName = 'CompanyAR' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = getCompanyValidator;

  protected async runDomain(
    input: GetCompanyRequestDod,
  ): Promise<ServiceResult<GetCompanyServiceParams>> {
    const repo = CompanyRepository.instance(this.moduleResolver);
    const result = await repo.getById(input.attrs.id);
    if (result.isFailure()) return failure(result.value);
    return success(result.value.getAttrs());
  }
}
