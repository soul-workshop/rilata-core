import { Logger } from '../../common/logger/logger';
import { DomainAttrs, GeneralEventDOD } from '../domain-object-data/types';

export abstract class EventHandler {
  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  abstract handle(aggregateAttrs: DomainAttrs, event: GeneralEventDOD): void
}
