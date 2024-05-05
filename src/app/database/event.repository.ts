import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import { GetARParamsEvents } from '../../domain/domain-data/type-functions';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolves/repositoriable';

export interface EventRepository {
  init(resovler: GeneralModuleResolver): void

  addEvents(event: GeneralEventDod[]): Promise<unknown>

  findEvent(id: UuidType): Promise<GeneralEventDod | undefined>

  isExist(id: UuidType): Promise<boolean>

  getAggregateEvents<A extends GeneralARDParams>(aRootId: UuidType): Promise<GetARParamsEvents<A>[]>
}

export const EventRepository = {
  instance(resolver: Repositoriable): EventRepository {
    return resolver.resolveRepo(EventRepository) as EventRepository;
  },
};
