import { RunMode } from '../../../../src/app/types';
import { AssertionException } from '../../../../src/common/exeptions';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { SubjectResolves } from '../../subject/resolves';
import { PersonRepositoryImpl } from '../../zz-infra/repositories/subject-module/person';

let db: FakeClassImplements.TestMemoryDatabase;

let subjectResolves: SubjectResolves;

export function getSubjectResolves(runMode: RunMode): SubjectResolves {
  if (!db) {
    db = new FakeClassImplements.TestMemoryDatabase();
  }

  if (!subjectResolves) {
    subjectResolves = {
      runMode: 'test',
      moduleName: 'SubjectModule',
      db,
      eventRepo: new FakeClassImplements.TestEventRepository(db),
      personRepo: new PersonRepositoryImpl(db),
    };
  }

  if (runMode === 'test') return subjectResolves;
  throw new AssertionException('not implements other run modes');
}
