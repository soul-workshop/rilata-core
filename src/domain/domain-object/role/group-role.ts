import { UserId } from '../../../core/types';
import { GroupRoleAttrs } from '../types';

export abstract class GroupRole<A extends GroupRoleAttrs> {
  constructor(protected attrs: A) {}

  inThisRole(userId: UserId): boolean {
    return this.attrs.userIds.some((listUserId) => listUserId === userId);
  }
}
