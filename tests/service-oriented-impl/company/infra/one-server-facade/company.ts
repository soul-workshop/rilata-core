import { DomainUser, ModuleCaller } from '../../../../../src/api/controller/types.js';
import { GeneralModuleResolver } from '../../../../../src/api/module/types.js';
import { FullServiceResult } from '../../../../../src/api/service/types.js';
import { UuidType } from '../../../../../src/core/types.js';
import { dodUtility } from '../../../../../src/core/utils/dod/dod-utility.js';
import { CompanyFacade } from '../../facade.js';
import { CompanyModule } from '../../module.js';
import { GetCompanyRequestDod } from '../../services/get-company/s.params.js';
import { GetingCompanyService } from '../../services/get-company/service.js';

/** Реализация фасада для работы в рамках одного сервера */
export class CompanyFacadeOneServerImpl implements CompanyFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  getCompany(
    id: UuidType, caller: DomainUser,
  ): Promise<FullServiceResult<GetingCompanyService>> {
    const requestDod = dodUtility.getRequestDod<GetCompanyRequestDod>('getCompany', { id });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<CompanyModule>('CompanyModule')
      .executeService<GetingCompanyService>(requestDod, moduleCaller);
  }
}
