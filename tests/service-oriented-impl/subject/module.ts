import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { AddingPersonService } from './services/person/add-person/service';
import { GetingPersonByIinService } from './services/person/get-by-iin/service';

export class SubjectModule extends Module {
  moduleName = 'SubjectModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new GetingPersonByIinService(),
  ];

  commandServices: GeneralCommandService[] = [
    new AddingPersonService(),
  ];

  eventServices: GeneralEventService[] = [];

  services: GeneraQueryService[] = [];
}
