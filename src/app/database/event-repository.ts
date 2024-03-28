import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import { GetARParamsEvents } from '../../domain/domain-data/type-functions';
import { Repositoriable } from '../resolves/repositoriable';
import { BusMessageRepository } from './bus-message-repository';

export interface EventRepository extends BusMessageRepository<GeneralEventDod> {
  addEvents(event: GeneralEventDod[]): Promise<void>

  getAggregateEvents<A extends GeneralARDParams>(aRootId: UuidType): Promise<GetARParamsEvents<A>[]>
}

export const EventRepository = {
  instance(resolver: Repositoriable): EventRepository {
    return resolver.resolveRepo(EventRepository) as EventRepository;
  },
};
