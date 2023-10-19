import { Logger } from '../common/logger/logger';

export interface LoggerResolver {
  getLogger(): Logger
}
