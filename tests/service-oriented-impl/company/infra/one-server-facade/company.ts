import { DomainUser, ModuleCaller } from '../../../../../src/app/controller/types';
import { GeneralModuleResolver } from '../../../../../src/app/module/types';
import { ServiceResult } from '../../../../../src/app/service/types';
import { UuidType } from '../../../../../src/common/types';
import { dodUtility } from '../../../../../src/common/utils/dod/dod-utility';
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
  ): Promise<ServiceResult<GetCompanyServiceParams>> {
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
