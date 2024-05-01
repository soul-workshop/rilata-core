import { BusModuleResolves } from '../../../src/app/module/bus-module-resolves';
import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';

export type CompanyCmdResolves = BusModuleResolves<CompanyCmdModule> & {
  moduleUrls: ['/api/company-cmd-module/'],
  companyRepo: CompanyCmdRepository,
}
