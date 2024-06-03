import { BusMessageRepository } from '../../../src/api/database/bus-message.repository';
import { EventRepository } from '../../../src/api/database/event.repository';
import { ModuleResolves } from '../../../src/api/module/m-resolves';
import { CompanyReadRepository } from './domain/company/repo';
import { CompanyReadModule } from './module';

export type CompanyReadResolves = ModuleResolves<CompanyReadModule> & {
  moduleUrls: ['/api/company-read-module/'],
  companyRepo: CompanyReadRepository,
  busMessageRepo: BusMessageRepository<true>,
  eventRepo: EventRepository<true>
}
