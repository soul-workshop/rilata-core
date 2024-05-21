import { GeneralModuleResolver } from '../module/types';
import { GeneralServerResolver } from '../server/types';
import { Afterware } from './afterware';
import { Middleware } from './middleware';

export type GeneralMiddleware = Middleware<GeneralServerResolver | GeneralModuleResolver>;

export type GeneralAfterware = Afterware<GeneralServerResolver | GeneralModuleResolver>;

