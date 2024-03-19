import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { AddingUserService } from './services/user/add-user/service';
import { GetingUsersService } from './services/user/get-users/service';
import { UserJwtPayload } from './services/user/user-authentification/s-params';

export class AuthModule extends Module<UserJwtPayload> {
  moduleName = 'AuthModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new GetingUsersService(),
  ];

  commandServices: GeneralCommandService[] = [
    new AddingUserService(),
  ];

  eventServices: GeneralEventService[] = [];
}
