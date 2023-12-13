import { UserId } from '../../../common/types';
import { GroupRoleAttrs } from '../types';

export abstract class GroupRole<A extends GroupRoleAttrs> {
  constructor(protected attrs: A) {}

  inThisRole(userId: UserId): boolean {
    return Boolean(this.attrs.userIds.find((listUserId) => listUserId === userId));
  }
}
