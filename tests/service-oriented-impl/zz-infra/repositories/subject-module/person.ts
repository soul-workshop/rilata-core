import { EventRepository } from '../../../../../src/api/database/event.repository';
import { DatabaseObjectSavingError } from '../../../../../src/core/exeptions';
import { Logger } from '../../../../../src/core/logger/logger';
import { failure } from '../../../../../src/core/result/failure';
import { success } from '../../../../../src/core/result/success';
import { Result } from '../../../../../src/core/result/types';
import { dodUtility } from '../../../../../src/core/utils/dod/dod-utility';
import { dtoUtility } from '../../../../../src/core/utils/dto/dto-utility';
import { FakeClassImplements } from '../../../../fixtures/fake-class-implements';
import { PersonAttrs } from '../../../subject/domain-data/person/params';
import { PersonAR } from '../../../subject/domain-object/person/a-root';
import { PersonFactory } from '../../../subject/domain-object/person/factory';
import { PersonRepository } from '../../../subject/domain-object/person/repo';
import { PersonAlreadyExistsError, PersonDoesntExistByIdError, PersonDoesntExistByIinError } from '../../../subject/domain-object/person/repo-errors';
import { SubjectModuleResolver } from '../../../subject/resolver';

export class PersonRepositoryImpl implements PersonRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'person_repo', PersonAttrs & { version: number }, 'id'
  >;

  protected logger!: Logger;

  protected resolver!: SubjectModuleResolver;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('person_repo', 'id', testDb);
  }

  init(resolver: SubjectModuleResolver): void {
    this.logger = resolver.getLogger();
    this.resolver = resolver;
  }

  async addPerson(person: PersonAR): Promise<Result<PersonAlreadyExistsError, { id: string; }>> {
    const attrs = person.getAttrs();
    const findByIin = await this.testRepo.findByAttrs({ iin: attrs.iin });
    if (findByIin !== undefined) {
      return failure(dodUtility.getDomainError<PersonAlreadyExistsError>(
        'PersonAlreadyExistsError',
        'Человек с данным ИИН уже существует в системе',
        { iin: attrs.iin },
      ));
    }

    this.addEvents(person);

    const result = await this.testRepo.add({
      ...attrs,
      version: person.getHelper().getVersion(),
    });
    if (result.isFailure()) {
      throw new DatabaseObjectSavingError('exception in personRepo.addPerson method');
    }
    return success({ id: attrs.id });
  }

  async getById(id: string): Promise<Result<PersonDoesntExistByIdError, PersonAR>> {
    const result = await this.testRepo.find(id);
    if (!result) {
      return failure(dodUtility.getDomainError<PersonDoesntExistByIdError>(
        'PersonDoesntExistByIdError',
        'Не найден человек с id: {{id}}',
        { id },
      ));
    }
    const factory = new PersonFactory();
    return success(factory.restore(
      dtoUtility.excludeAttrs(result, 'version'),
      result.version,
    ));
  }

  async getByIin(iin: string): Promise<Result<PersonDoesntExistByIinError, PersonAR>> {
    const result = await this.testRepo.findByAttrs({ iin });
    if (!result) {
      return failure(dodUtility.getDomainError<PersonDoesntExistByIinError>(
        'PersonDoesntExistByIinError',
        'Не найден человек с ИИН: {{iin}}',
        { iin },
      ));
    }
    const factory = new PersonFactory();
    return success(factory.restore(
      dtoUtility.excludeAttrs(result, 'version'),
      result.version,
    ));
  }

  protected async addEvents(person: PersonAR): Promise<void> {
    const eventRepo = EventRepository.instance(this.resolver);
    await eventRepo.addEvents(person.getHelper().getEvents());
    person.getHelper().cleanEvents();
  }
}
