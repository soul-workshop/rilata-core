import { DomainUser, ModuleCaller } from '../../../../../src/api/controller/types';
import { GeneralModuleResolver } from '../../../../../src/api/module/types';
import { FullServiceResult, ServiceResult } from '../../../../../src/api/service/types';
import { UuidType } from '../../../../../src/core/types';
import { dodUtility } from '../../../../../src/core/utils/dod/dod-utility';
import { CompanyFacade } from '../../facade';
import { CompanyModule } from '../../module';
import { GetCompanyRequestDod, GetCompanyServiceParams } from '../../services/get-company/s.params';

/** Реализация фасада для работы в рамках одного сервера */
export class CompanyFacadeOneServerImpl implements CompanyFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  getCompany(
    id: UuidType, caller: DomainUser,
  ): Promise<FullServiceResult<GetCompanyServiceParams>> {
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
      .executeService(requestDod, moduleCaller);
  }
}
