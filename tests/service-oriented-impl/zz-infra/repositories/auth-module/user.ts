import { EventRepository } from '../../../../../src/app/database/event-repository';
import { DatabaseObjectSavingError } from '../../../../../src/common/exeptions';
import { Logger } from '../../../../../src/common/logger/logger';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { FakeClassImplements } from '../../../../fixtures/fake-class-implements';
import { UserRepository, UserRepositoryRecord } from '../../../auth/domain-object/user/repo';
import { UserDoesNotExistByIdError } from '../../../auth/domain-object/user/repo-errors';
import { AuthModuleResolver } from '../../../auth/resolver';
import { UserAddedEvent } from '../../../auth/services/user/add-user/s-params';

export class UserRepositoryImpl implements UserRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'user_repo', UserRepositoryRecord, 'userId'
  >;

  protected logger!: Logger;

  protected resolver!: AuthModuleResolver;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('user_repo', 'userId', testDb);
  }

  init(resolver: AuthModuleResolver): void {
    this.logger = resolver.getLogger();
    this.resolver = resolver;
  }

  async addUser(
    attrs: UserRepositoryRecord,
  ): Promise<Result<never, { userId: UuidType }>> {
    this.addEvent(attrs);

    const result = await this.testRepo.add({ ...attrs });
    if (result.isFailure()) {
      throw new DatabaseObjectSavingError(`user by id ${attrs.userId} is already exist`);
    }
    return success({ userId: attrs.userId });
  }

  async getUser(id: string): Promise<Result<UserDoesNotExistByIdError, UserRepositoryRecord>> {
    const result = await this.testRepo.find(id);
    if (result === undefined) {
      return failure(dodUtility.getDomainError<UserDoesNotExistByIdError>(
        'UserDoesNotExistByIdError',
        'Не найден пользователь с id {{id}}',
        { id },
      ));
    }
    return success(result);
  }

  async findByIin(iin: string): Promise<UserRepositoryRecord[]> {
    return this.testRepo.filterByAttrs({ personIin: iin });
  }

  async addEvent(attrs: UserRepositoryRecord): Promise<void> {
    const event = dodUtility.getEvent<UserAddedEvent>(
      'UserAddedEvent',
      attrs,
      {
        attrs: { userId: attrs.userId, personIin: attrs.personIin },
        meta: {
          name: 'UserAR', idName: 'userId', domainType: 'aggregate', version: 0,
        },
      },
    );
    const eventRepo = EventRepository.instance(this.resolver);
    await eventRepo.addEvents([event]);
  }
}
