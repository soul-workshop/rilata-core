import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
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
