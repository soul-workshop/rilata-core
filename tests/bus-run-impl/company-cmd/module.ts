import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { UserJwtPayload } from '../types';
import { AddingCompanyService } from './services/company/add-company/service';

export class CompanyCmdModule extends Module<UserJwtPayload> {
  moduleName = 'CompanyCmdModule' as const;

  moduleType: ModuleType = 'command-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [
    new AddingCompanyService(),
  ];

  eventServices: GeneralEventService[] = [];
}
