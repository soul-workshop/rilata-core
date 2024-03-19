import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { UserJwtPayload } from '../types';
import { CompanyAddedService } from './services/company-added/service';

export class CompanyReadModule extends Module<UserJwtPayload> {
  moduleName = 'CompanyReadModule' as const;

  moduleType: ModuleType = 'read-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [
    new CompanyAddedService(),
  ];
}
