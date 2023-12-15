import { GeneralCommandUcParams } from './types';
import { QueryUseCase } from './query-use-case';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams,
> extends QueryUseCase<UC_PARAMS> {}
