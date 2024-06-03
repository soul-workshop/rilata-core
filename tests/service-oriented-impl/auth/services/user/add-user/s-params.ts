import { CommandServiceParams } from '../../../../../../src/api/service/types';
import { UuidType } from '../../../../../../src/core/types';
import { RequestDod, EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { UserARDT, UserParams } from '../../../domain-data/user/params';

export type AddUserRequestDodAttrs = {
  personIin: UuidType,
}

export type AddUserRequestDod = RequestDod<'addUser', AddUserRequestDodAttrs>

export type AddUserOut = {
  userId: UuidType
}

export type UserAddedEvent = EventDod<
  'UserAddedEvent', 'AddingUserService', 'AuthModule', AddUserRequestDodAttrs, UserARDT
>

export type AddUserServiceParams = CommandServiceParams<
  'AddingUserService',
  UserParams,
  AddUserRequestDod,
  AddUserOut,
  never,
  UserAddedEvent[]
>
