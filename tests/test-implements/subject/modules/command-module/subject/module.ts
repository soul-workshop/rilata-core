import { Module } from '../../../../../../src/app/module/module';
import { GeneraQuerylUseCase } from '../../../../../../src/app/use-case/types';
import { AddingPersonUC } from '../../../cm-use-case/adding-person/use-case';

export class SubjectModule extends Module {
  useCases: GeneraQuerylUseCase[] = [
    new AddingPersonUC(),
  ];

  getName(): string {
    return this.constructor.name;
  }
}
