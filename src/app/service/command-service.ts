import { MuttableService } from './muttable-service';
import { GeneralCommandServiceParams } from './types';

export abstract class CommandService<PARAMS extends GeneralCommandServiceParams>
  extends MuttableService<PARAMS> {}
