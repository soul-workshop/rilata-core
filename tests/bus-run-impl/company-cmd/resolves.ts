import { BusMessageRepository } from '../../../src/app/database/bus-message.repository';
import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolves } from '../../../src/app/module/m-resolves';
import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';

export type CompanyCmdResolves = ModuleResolves<CompanyCmdModule> & {
  moduleUrls: ['/api/company-cmd-module/'],
  companyRepo: CompanyCmdRepository,
  busMessageRepo: BusMessageRepository<true>,
  eventRepo: EventRepository<true>
}
