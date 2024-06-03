import { UuidType } from '../../core/types';
import { GeneralArParams, GeneralEventDod } from '../../domain/domain-data/domain-types';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolve/repositoriable';
import { Asyncable } from './types';

export interface EventRepository<ASYNC extends boolean> {
  init(resovler: GeneralModuleResolver): void

  addEvents(event: GeneralEventDod[]): Asyncable<ASYNC, unknown>

  findEvent(id: UuidType): Asyncable<ASYNC, GeneralEventDod | undefined>

  isExist(id: UuidType): Asyncable<ASYNC, boolean>

  // eslint-disable-next-line max-len
  getAggregateEvents<A extends GeneralArParams>(aRootId: UuidType): Asyncable<ASYNC, A['events']>
}

export const EventRepository = {
  instance<ASYNC extends boolean>(resolver: Repositoriable): EventRepository<ASYNC> {
    return resolver.resolveRepo(EventRepository) as EventRepository<ASYNC>;
  },
};
