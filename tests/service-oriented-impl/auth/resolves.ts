import { EventRepository } from '../../../src/api/database/event.repository';
import { ModuleResolves } from '../../../src/api/module/m-resolves';
import { UserRepository } from './domain-object/user/repo';
import { AuthModule } from './module';

export type AuthResolves = ModuleResolves<AuthModule> & {
  moduleUrls: ['/api/auth-module/'],
  userRepo: UserRepository,
  eventRepo: EventRepository<true>,
}
