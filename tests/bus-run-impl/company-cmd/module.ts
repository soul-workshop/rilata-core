import { Module } from '../../../src/api/module/module';
import { ModuleType } from '../../../src/api/module/types';
import { GeneralEventService, GeneraQueryService } from '../../../src/api/service/types';
import { AddingCompanyService } from './services/company/add-company/service';

export class CompanyCmdModule extends Module {
  moduleName = 'CompanyCmdModule' as const;

  moduleType: ModuleType = 'command-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices = [
    new AddingCompanyService(),
  ];

  eventServices: GeneralEventService[] = [];
}
