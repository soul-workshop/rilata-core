import { BusModuleResolves } from '../../../src/app/module/bus-module-resolves';
import { CompanyReadRepository } from './domain/company/repo';
import { CompanyReadModule } from './module';

export type CompanyReadResolves = BusModuleResolves<CompanyReadModule> & {
  moduleUrls: ['/api/company-read-module/'],
  companyRepo: CompanyReadRepository,
}
