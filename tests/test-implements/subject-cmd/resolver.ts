import { Database } from '../../../src/app/database/database';
import { DomainEventRepository } from '../../../src/app/database/domain-event-repository';
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { SubjectCmdModule } from './module';

export class SubjectCmdModuleResolver extends ModuleResolver<SubjectCmdModule> {
  moduleConfig: ModuleConfig = {
    url: 'api/subject-cmd-module/',

    eventDelivererPath: `${(import.meta as any).path}/event-deliverer.ts`,
  };

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getEventRepository(): DomainEventRepository {
    throw new Error('Method not implemented.');
  }

  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getRepository(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }
}
