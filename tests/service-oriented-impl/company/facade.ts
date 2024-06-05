import { DomainUser } from '../../../src/api/controller/types';
import { GeneralModuleResolver } from '../../../src/api/module/types';
import { Facadable } from '../../../src/api/resolve/facadable';
import { FullServiceResult } from '../../../src/api/service/types';
import { UuidType } from '../../../src/core/types';
import { GetCompanyServiceParams } from './services/get-company/s.params';

export interface CompanyFacade {
  init(resolver: GeneralModuleResolver): void
  getCompany(id: UuidType, caller: DomainUser): Promise<FullServiceResult<GetCompanyServiceParams>>
}

export const CompanyFacade = {
  instance(resolver: Facadable): CompanyFacade {
    return resolver.resolveFacade(CompanyFacade) as CompanyFacade;
  },
};
