import { Module } from '../../../src/api/module/module';
import { ModuleType } from '../../../src/api/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types';
import { AddingUserService } from './services/user/add-user/service';
import { GetingUsersService } from './services/user/get-users/service';

export class AuthModule extends Module {
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
