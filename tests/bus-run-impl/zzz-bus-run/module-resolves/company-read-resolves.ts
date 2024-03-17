import { EventRepository } from '../../../../src/app/database/event-repository';
import { RunMode } from '../../../../src/app/types';
import { AssertionException } from '../../../../src/common/exeptions';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyReadRepository } from '../../company-read/domain/company/repo';
import { CompanyReadResolves } from '../../company-read/resolves';
import { CompanyReadRepositoryImpl } from '../../zz-infra/repositories/company-read';

let isResolved = false;

let companyResolves: CompanyReadResolves;

let db: FakeClassImplements.TestMemoryDatabase;

let eventRepo: EventRepository;

let companyRepo: CompanyReadRepository;

export function getCompanyReadResolves(runMode: RunMode): CompanyReadResolves {
  if (isResolved === false) {
    db = new FakeClassImplements.TestMemoryDatabase();
    eventRepo = new FakeClassImplements.TestEventRepository(db);
    companyRepo = new CompanyReadRepositoryImpl(db);
    companyResolves = {
      tokenSecretKey: 'your-256-bit-secret',
      runMode: 'test',
      moduleName: 'CompanyReadModule',
      db,
      busMessageRepo: eventRepo,
      companyRepo,
    };
    Object.freeze(companyResolves);
    isResolved = true;
  }

  if (runMode === 'test') return companyResolves;
  throw new AssertionException('not implements other run modes');
}
