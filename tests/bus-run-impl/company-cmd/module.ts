import { WebModule } from '#api/module/web.module.js';
import { ModuleType } from '../../../src/api/module/types.js';
import { GeneralEventService, GeneraQueryService } from '../../../src/api/service/types.js';
import { AddingCompanyService } from './services/company/add-company/service.js';

export class CompanyCmdModule extends WebModule {
  moduleName = 'CompanyCmdModule' as const;

  moduleType: ModuleType = 'command-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices = [
    new AddingCompanyService(),
  ];

  eventServices: GeneralEventService[] = [];
}
