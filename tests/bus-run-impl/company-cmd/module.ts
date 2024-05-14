import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
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
