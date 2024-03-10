import { EventBusMessageType } from '../../../../../src/app/bus/types';
import { EventRepository } from '../../../../../src/app/database/event-repository';
import { EventService } from '../../../../../src/app/service/event-service';
import { ServiceResult } from '../../../../../src/app/service/types';
import { success } from '../../../../../src/common/result/success';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { CompanyAddedEvent } from '../../../company-cmd/domain-data/company/add-company/a-params';
import { CompanyReadRepository } from '../../domain/company/repo';
import { CompanyAddedServiceParams } from './s-params';

export class CompanyAddedService extends EventService<CompanyAddedServiceParams> {
  eventBusMessateType: EventBusMessageType = 'event';

  publishModuleName = 'CompanyCmdModule'; // moduleName where event published

  serviceName = 'CompanyAddedEvent' as const; // serviceName is eventName

  aRootName = 'CompanyAR' as const;

  protected async runDomain(
    input: CompanyAddedEvent,
  ): Promise<ServiceResult<CompanyAddedServiceParams>> {
    const companyAttrs = { ...input.aRoot.attrs, version: input.aRoot.meta.version };
    const eventRepo = EventRepository.instance(this.moduleResolver);
    eventRepo.addEvents([
      dodUtility.regenerateEvent(input, this.moduleResolver.getModuleName()),
    ]);
    const repo = CompanyReadRepository.instance(this.moduleResolver);
    repo.addCompany(companyAttrs);
    return success(undefined);
  }
}
