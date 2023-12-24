import { Logger } from '../../common/logger/logger';

export interface Loggable {
  getLogger(): Logger
}
