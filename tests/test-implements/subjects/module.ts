import { Module } from '../../../src/app/module/module';
import { ClassOptionable } from '../../../src/app/use-case/class-optionable';
import { InstanceOptionable } from '../../../src/app/use-case/instance-optionable';
import { AggregateRoot } from '../../../src/domain/domain-object/aggregate-root';

export class SubjectModule extends Module {
  getName(): string {
    return this.constructor.name;
  }

  getClassUseCases(aggregate: AggregateRoot): ClassOptionable[] {
    throw new Error('Method not implemented.');
  }

  getInstanceUseCases(aggregate: AggregateRoot): InstanceOptionable[] {
    throw new Error('Method not implemented.');
  }
}
