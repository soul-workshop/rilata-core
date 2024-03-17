import { EventRepository } from '../../../../src/app/database/event-repository';
import { RunMode } from '../../../../src/app/types';
import { AssertionException } from '../../../../src/common/exeptions';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyCmdRepository } from '../../company-cmd/domain-object/company/repo';
import { CompanyCmdResolves } from '../../company-cmd/resolves';
import { CompanyCmdRepositoryImpl } from '../../zz-infra/repositories/company-cmd';

let isResolved = false;

let companyResolves: CompanyCmdResolves;

let db: FakeClassImplements.TestMemoryDatabase;

let eventRepo: EventRepository;

let companyRepo: CompanyCmdRepository;

export function getCompanyCmdResolves(runMode: RunMode): CompanyCmdResolves {
  if (isResolved === false) {
    db = new FakeClassImplements.TestMemoryDatabase();
    eventRepo = new FakeClassImplements.TestEventRepository(db);
    companyRepo = new CompanyCmdRepositoryImpl(db);
    companyResolves = {
      tokenSecretKey: 'your-256-bit-secret',
      runMode: 'test',
      moduleName: 'CompanyCmdModule',
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
