import { EventRepository } from '../../../../src/app/database/event-repository';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyCmdRepository } from '../../company-cmd/domain-object/company/repo';
import { CompanyCmdResolves } from '../../company-cmd/resolves';
import { CompanyCmdRepositoryImpl } from '../../zz-infra/repositories/company-cmd';

let isResolved = false;

let companyResolves: CompanyCmdResolves;

let db: FakeClassImplements.TestMemoryDatabase;

let eventRepo: EventRepository;

let companyRepo: CompanyCmdRepository;

export function getCompanyCmdResolves(): CompanyCmdResolves {
  if (isResolved === false) {
    db = new FakeClassImplements.TestMemoryDatabase();
    eventRepo = new FakeClassImplements.TestEventRepository(db);
    companyRepo = new CompanyCmdRepositoryImpl(db);
    companyResolves = {
      moduleName: 'CompanyCmdModule',
      moduleUrl: '/api/company-cmd-module/',
      db,
      busMessageRepo: eventRepo,
      companyRepo,
    };
    Object.freeze(companyResolves);
    isResolved = true;
  }

  return companyResolves;
}
