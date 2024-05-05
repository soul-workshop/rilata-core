import { BusMessageRepository } from '../../../src/app/database/bus-message.repository';
import { EventRepository } from '../../../src/app/database/event.repository';
import { UowModuleResolves } from '../../../src/app/module/uow.module/resolves';
import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';

export type CompanyCmdResolves = UowModuleResolves<CompanyCmdModule> & {
  moduleUrls: ['/api/company-cmd-module/'],
  companyRepo: CompanyCmdRepository,
  busMessageRepo: BusMessageRepository,
  eventRepo: EventRepository
}
