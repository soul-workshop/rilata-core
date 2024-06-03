import { Module } from '../../../src/api/module/module';
import { ModuleType } from '../../../src/api/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types';
import { GetingCompanyService } from './services/get-company/service';
import { RegisteringCompanyService } from './services/register-company/service';

export class CompanyModule extends Module {
  moduleName = 'CompanyModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new GetingCompanyService(),
  ];

  commandServices: GeneralCommandService[] = [
    new RegisteringCompanyService(),
  ];

  eventServices: GeneralEventService[] = [];
}
