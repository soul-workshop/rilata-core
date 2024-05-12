import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { GetingFullCompanyService } from './services/get-full-company/service';

export class FrontProxyModule extends Module {
  moduleType: ModuleType = 'read-module' as const;

  moduleName = 'FrontProxyModule' as const;

  queryServices: GeneraQueryService[] = [
    new GetingFullCompanyService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
