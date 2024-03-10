import { EventServiceParams } from '../../../../../src/app/service/types';
import { CompanyAddedEvent } from '../../../company-cmd/domain-data/company/add-company/a-params';
import { CompanyParams } from '../../../company-cmd/domain-data/company/params';

export type CompanyAddedServiceParams = EventServiceParams<
  CompanyParams,
  CompanyAddedEvent,
  CompanyAddedEvent[]
>
