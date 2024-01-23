import { UserId } from '../../../common/types';
import { RoleAttrs } from '../types';

export abstract class Role<A extends RoleAttrs> {
  constructor(protected attrs: A) {}

  inThisRole(userId: UserId): boolean {
    return userId === this.attrs.userId;
  }
}
