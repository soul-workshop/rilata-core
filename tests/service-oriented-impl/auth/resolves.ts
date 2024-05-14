import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolves } from '../../../src/app/module/m-resolves';
import { UserRepository } from './domain-object/user/repo';
import { AuthModule } from './module';

export type AuthResolves = ModuleResolves<AuthModule> & {
  moduleUrls: ['/api/auth-module/'],
  userRepo: UserRepository,
  eventRepo: EventRepository<true>,
}
