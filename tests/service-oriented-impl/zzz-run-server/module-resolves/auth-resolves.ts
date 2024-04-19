import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { AuthResolves } from '../../auth/resolves';
import { UserRepositoryImpl } from '../../zz-infra/repositories/auth-module/user';

let db: FakeClassImplements.TestMemoryDatabase;

let authResolves: AuthResolves;

export function getAuthResolves(): AuthResolves {
  if (!db) {
    db = new FakeClassImplements.TestMemoryDatabase();
  }

  if (!authResolves) {
    authResolves = {
      moduleName: 'AuthModule',
      moduleUrls: ['/api/auth-module/'],
      db,
      busMessageRepo: new FakeClassImplements.TestEventRepository(db),
      userRepo: new UserRepositoryImpl(db),
    };
  }

  return authResolves;
}
