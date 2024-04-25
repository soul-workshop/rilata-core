import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { SubjectResolves } from '../../subject/resolves';
import { PersonRepositoryImpl } from '../../zz-infra/repositories/subject-module/person';

let db: FakeClassImplements.TestMemoryDatabase;

let subjectResolves: SubjectResolves;

export function getSubjectResolves(): SubjectResolves {
  if (!db) {
    db = new FakeClassImplements.TestMemoryDatabase();
  }

  if (!subjectResolves) {
    subjectResolves = {
      moduleName: 'SubjectModule',
      moduleUrls: ['/api/subject-module/'],
      db,
      busMessageRepo: new FakeClassImplements.TestEventRepository(db),
      personRepo: new PersonRepositoryImpl(db),
    };
  }

  return subjectResolves;
}
