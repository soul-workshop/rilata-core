import { BusMessageRepository } from '../../../src/app/database/bus-message.repository';
import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolves } from '../../../src/app/module/m-resolves';
import { CompanyReadRepository } from './domain/company/repo';
import { CompanyReadModule } from './module';

export type CompanyReadResolves = ModuleResolves<CompanyReadModule> & {
  moduleUrls: ['/api/company-read-module/'],
  companyRepo: CompanyReadRepository,
  busMessageRepo: BusMessageRepository<true>,
  eventRepo: EventRepository<true>
}
