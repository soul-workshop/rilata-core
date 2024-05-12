import { EventRepository } from '../../../../../src/app/database/event.repository';
import { EventService } from '../../../../../src/app/service/concrete-service/event.service';
import { UowTransactionStrategy } from '../../../../../src/app/service/transaction-strategy/uow.strategy';
import { ServiceResult } from '../../../../../src/app/service/types';
import { success } from '../../../../../src/common/result/success';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { CompanyAddedEvent } from '../../../company-cmd/domain-data/company/add-company/a-params';
import { CompanyReadRepository } from '../../domain/company/repo';
import { CompanyReadModuleResolver } from '../../resolver';
import { CompanyAddedServiceParams } from './s-params';

export class CompanyAddedService extends EventService<
  CompanyAddedServiceParams, CompanyReadModuleResolver
> {
  inputDodName = 'CompanyAddedEvent' as const; // имя входящего события

  eventServiceName = 'AddingCompanyService' as const; // имя сервиса которое выпустило событие

  eventModuleName = 'CompanyCmdModule' as const; // имя модуля которое выпустио событие

  moduleName = 'CompanyReadModule' as const; // имя данного модуля

  serviceName = 'CompanyAddedService' as const; // имя данного сервиса

  busMessageType = 'event' as const;

  protected transactionStrategy = new UowTransactionStrategy(true);

  aRootName = 'CompanyAR' as const;

  async runDomain(
    input: CompanyAddedEvent,
  ): Promise<ServiceResult<CompanyAddedServiceParams>> {
    const companyAttrs = { ...input.aRoot.attrs, version: input.aRoot.meta.version };
    const eventRepo = EventRepository.instance(this.moduleResolver);
    eventRepo.addEvents([
      dodUtility.regenerateEvent(input, this.serviceName, this.moduleName),
    ]);
    const repo = CompanyReadRepository.instance(this.moduleResolver);
    repo.addCompany(companyAttrs);
    return success(undefined);
  }
}
