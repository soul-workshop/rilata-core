import { RunMode } from '../../../../src/app/types';
import { AssertionException } from '../../../../src/common/exeptions';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { AuthResolves } from '../../auth/resolves';
import { UserRepositoryImpl } from '../../zz-infra/repositories/auth-module/user';

let db: FakeClassImplements.TestMemoryDatabase;

let authResolves: AuthResolves;

export function getAuthResolves(runMode: RunMode): AuthResolves {
  if (!db) {
    db = new FakeClassImplements.TestMemoryDatabase();
  }

  if (!authResolves) {
    authResolves = {
      runMode: 'test',
      moduleName: 'AuthModule',
      db,
      eventRepo: new FakeClassImplements.TestEventRepository(db),
      userRepo: new UserRepositoryImpl(db),
    };
  }

  if (runMode === 'test') return authResolves;
  throw new AssertionException('not implements other run modes');
}
