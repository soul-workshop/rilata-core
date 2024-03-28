import { DomainUser } from '../../../src/app/caller';
import { GeneralModuleResolver } from '../../../src/app/module/types';
import { Facadable } from '../../../src/app/resolves/facadable';
import { ServiceResult } from '../../../src/app/service/types';
import { UuidType } from '../../../src/common/types';
import { GetCompanyServiceParams } from './services/get-company/s.params';

export interface CompanyFacade {
  init(resolver: GeneralModuleResolver): void
  getCompany(id: UuidType, caller: DomainUser): Promise<ServiceResult<GetCompanyServiceParams>>
}

export const CompanyFacade = {
  instance(resolver: Facadable): CompanyFacade {
    return resolver.resolveFacade(CompanyFacade) as CompanyFacade;
  },
};
