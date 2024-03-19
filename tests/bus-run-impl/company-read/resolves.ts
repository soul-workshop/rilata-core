import { ModuleResolves } from '../../../src/app/module/module-resolves';
import { CompanyReadRepository } from './domain/company/repo';
import { CompanyReadModule } from './module';

export type CompanyReadResolves = ModuleResolves<CompanyReadModule> & {
  companyRepo: CompanyReadRepository,
}