import { Caller } from '../../../app/caller';
import { UserId } from '../../types';

class CallerUtility {
  /** если пользователь не авторизован, то вернет undefined, иначе userId */
  findUserId(caller: Caller): UserId | undefined {
    if (caller.type === 'AnonymousUser') return undefined;
    if (caller.type === 'DomainUser') return caller.id;
    if (caller.user.type === 'AnonymousUser') return undefined;
    return caller.user.id;
  }

  /** возвращает userId, если пользователь не авторизован, то выкинет исключение */
  getUserId(caller: Caller): UserId {
    const finded = this.findUserId(caller);
    if (finded) return finded;
    throw Error('user id is not finded');
  }
}

export const callerUtility = new CallerUtility();
