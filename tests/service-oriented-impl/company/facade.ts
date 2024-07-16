import { DomainUser } from '../../../src/api/controller/types.js';
import { GeneralModuleResolver } from '../../../src/api/module/types.js';
import { Facadable } from '../../../src/api/resolve/facadable.js';
import { FullServiceResult } from '../../../src/api/service/types.js';
import { UuidType } from '../../../src/core/types.js';
import { GetingCompanyService } from './services/get-company/service.js';

export interface CompanyFacade {
  init(resolver: GeneralModuleResolver): void
  getCompany(id: UuidType, caller: DomainUser): Promise<FullServiceResult<GetingCompanyService>>
}

export const CompanyFacade = {
  instance(resolver: Facadable): CompanyFacade {
    return resolver.resolveFacade(CompanyFacade) as CompanyFacade;
  },
};
