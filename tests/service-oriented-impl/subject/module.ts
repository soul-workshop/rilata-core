import { WebModule } from '#api/module/web.module.js';
import { ModuleType } from '../../../src/api/module/types.js';
import { GeneralCommandService, GeneralEventService, GeneraQueryService } from '../../../src/api/service/types.js';
import { AddingPersonService } from './services/person/add-person/service.js';
import { GetingPersonByIinService } from './services/person/get-by-iin/service.js';

export class SubjectModule extends WebModule {
  moduleName = 'SubjectModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new GetingPersonByIinService(),
  ];

  commandServices: GeneralCommandService[] = [
    new AddingPersonService(),
  ];

  eventServices: GeneralEventService[] = [];
}
