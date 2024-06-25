import { WebModule } from '#api/module/web.module.js';
import { ModuleType } from '../../../src/api/module/types.js';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types.js';
import { CompanyAddedService } from './services/company-added/service.js';

export class CompanyReadModule extends WebModule {
  moduleName = 'CompanyReadModule' as const;

  moduleType: ModuleType = 'read-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [
    new CompanyAddedService(),
  ];
}
