import { Repositoriable } from '../../../../../src/app/resolves/repositoriable';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { UserAttrs } from '../../domain-data/user/params';
import { AuthModuleResolver } from '../../resolver';
import { UserDoesNotExistByIdError } from './repo-errors';

export type UserRepositoryRecord = UserAttrs & { version: number }

export interface UserRepository {
  init(resolver: AuthModuleResolver): void
  addUser(attrs: UserRepositoryRecord): Promise<Result<never, { userId: UuidType }>>
  getUser(id: UuidType): Promise<Result<UserDoesNotExistByIdError, UserRepositoryRecord>>
  findByIin(iin: string): Promise<UserRepositoryRecord[]>
}

export const UserRepository = {
  instance(resolver: Repositoriable): UserRepository {
    return resolver.resolveRepo(UserRepository) as UserRepository;
  },
};
