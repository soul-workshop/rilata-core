import { AggregateRoot } from '../../domain/domain-object/aggregate-root';
import { ClassOptionable } from '../use-case/class-optionable';
import { InstanceOptionable } from '../use-case/instance-optionable';

export abstract class Module {
  abstract getName(): string;

  abstract getClassUseCases(aggregate: typeof AggregateRoot): ClassOptionable[]

  abstract getInstanceUseCases(aggregate: typeof AggregateRoot): InstanceOptionable[]
}
