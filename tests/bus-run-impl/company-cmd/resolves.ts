import { ModuleResolves } from '../../../src/app/module/module-resolves';
import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';

export type CompanyCmdResolves = ModuleResolves<CompanyCmdModule> & {
  moduleUrl: '/api/company-cmd-module/',
  companyRepo: CompanyCmdRepository,
}
