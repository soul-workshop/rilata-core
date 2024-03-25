import { EventRepository } from '../../../../src/app/database/event-repository';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyReadRepository } from '../../company-read/domain/company/repo';
import { CompanyReadResolves } from '../../company-read/resolves';
import { CompanyReadRepositoryImpl } from '../../zz-infra/repositories/company-read';

let isResolved = false;

let companyResolves: CompanyReadResolves;

let db: FakeClassImplements.TestMemoryDatabase;

let eventRepo: EventRepository;

let companyRepo: CompanyReadRepository;

export function getCompanyReadResolves(): CompanyReadResolves {
  if (isResolved === false) {
    db = new FakeClassImplements.TestMemoryDatabase();
    eventRepo = new FakeClassImplements.TestEventRepository(db);
    companyRepo = new CompanyReadRepositoryImpl(db);
    companyResolves = {
      moduleName: 'CompanyReadModule',
      moduleUrl: '/api/company-read-module/',
      db,
      busMessageRepo: eventRepo,
      companyRepo,
    };
    Object.freeze(companyResolves);
    isResolved = true;
  }

  return companyResolves;
}
