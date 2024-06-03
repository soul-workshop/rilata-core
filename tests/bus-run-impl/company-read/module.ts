import { Module } from '../../../src/api/module/module';
import { ModuleType } from '../../../src/api/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types';
import { CompanyAddedService } from './services/company-added/service';

export class CompanyReadModule extends Module {
  moduleName = 'CompanyReadModule' as const;

  moduleType: ModuleType = 'read-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [
    new CompanyAddedService(),
  ];
}
