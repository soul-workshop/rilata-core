import { CommandServiceParams } from '../../../../../../src/app/service/types';
import { UuidType } from '../../../../../../src/common/types';
import { RequestDod, EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { UserARDT, UserParams } from '../../../domain-data/user/params';

export type AddUserRequestDodAttrs = {
  personIin: UuidType,
}

export type AddUserRequestDod = RequestDod<'addUser', AddUserRequestDodAttrs>

export type AddUserOut = {
  userId: UuidType
}

export type UserAddedEvent = EventDod<'UserAddedEvent', AddUserRequestDodAttrs, UserARDT>

export type AddUserServiceParams = CommandServiceParams<
  UserParams,
  AddUserRequestDod,
  AddUserOut,
  never,
  UserAddedEvent[]
>
