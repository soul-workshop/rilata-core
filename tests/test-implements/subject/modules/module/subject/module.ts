import { Module } from '../../../../../../src/app/module/module';
import { GeneralCommandUseCase, GeneraQuerylUseCase } from '../../../../../../src/app/use-case/types';
import { AddingPersonUC } from '../../../cm-use-case/adding-person/use-case';

export class SubjectModule extends Module<'module'> {
  moduleType = 'module' as const;

  moduleName = 'SubjectModule';

  queryUseCases: GeneraQuerylUseCase[] = [];

  commandUseCases: GeneralCommandUseCase[] = [
    new AddingPersonUC(),
  ];

  useCases: GeneraQuerylUseCase[] = [];

  getName(): string {
    return this.constructor.name;
  }
}
