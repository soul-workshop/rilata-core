import { Logger } from '../../common/logger/logger';
import { DomainAttrs, GeneralEventDod } from '../domain-object-data/types';

export abstract class EventHandler {
  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  abstract handle(aggregateAttrs: DomainAttrs, event: GeneralEventDod): void
}
