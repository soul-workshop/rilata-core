import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolves } from '../../../src/app/module/m-resolves';
import { PersonRepository } from './domain-object/person/repo';
import { SubjectModule } from './module';

export type SubjectResolves = ModuleResolves<SubjectModule> & {
  moduleUrls: ['/api/subject-module/'],
  personRepo: PersonRepository,
  eventRepo: EventRepository<true>,
}
