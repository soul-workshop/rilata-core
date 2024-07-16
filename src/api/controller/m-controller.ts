import { GeneralModuleResolver } from '../module/types.js';
import { Controller } from './controller.js';

export abstract class ModuleController extends Controller <GeneralModuleResolver> {
  getUrls(): string[] | RegExp[] {
    return this.resolver.getModuleUrls();
  }
}
