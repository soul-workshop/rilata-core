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

export class UserRepositoryImpl implements UserRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'user_repo', UserRepositoryRecord, 'userId'
  >;

  protected logger!: Logger;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('user_repo', 'userId', testDb);
  }

  init(resolver: AuthModuleResolver): void {
    this.logger = resolver.getLogger();
  }

  async addUser(
    attrs: UserRepositoryRecord,
  ): Promise<Result<never, { userId: UuidType }>> {
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
}
