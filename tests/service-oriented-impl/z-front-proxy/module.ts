import { Module } from '../../../src/api/module/module';
import { ModuleType } from '../../../src/api/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types';
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
