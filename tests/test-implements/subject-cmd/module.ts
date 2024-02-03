import { Module } from '../../../src/app/module/module';
import { ModuleType } from '../../../src/app/module/types';
import { GeneralCommandService, GeneraQueryService } from '../../../src/app/service/types';
import { AddingPersonService } from './services/adding-person/service';

export class SubjectModule extends Module {
  moduleType: ModuleType = 'common-module' as const;

  moduleName = 'SubjectModule';

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [
    new AddingPersonService(),
  ];

  services: GeneraQueryService[] = [];

  getName(): string {
    return this.constructor.name;
  }
}
