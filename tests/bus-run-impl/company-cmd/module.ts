import { ModuleType } from '../../../src/app/module/types';
import { UowModule } from '../../../src/app/module/uow.module/module';
import { UowCommandService } from '../../../src/app/service/command-service/uow-command.service';
import { GeneralCommandServiceParams, GeneralEventService, GeneraQueryService } from '../../../src/app/service/types';
import { UserJwtPayload } from '../types';
import { AddingCompanyService } from './services/company/add-company/service';

export class CompanyCmdModule extends UowModule<UserJwtPayload> {
  moduleName = 'CompanyCmdModule' as const;

  moduleType: ModuleType = 'command-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: UowCommandService<GeneralCommandServiceParams>[] = [
    new AddingCompanyService(),
  ];

  eventServices: GeneralEventService[] = [];
}
