import { ModuleResolveInstance } from './types';

/** Объявляет интерфейс для получения объектов фасадов других модулей */
export interface Facadable {
  resolveFacade(...args: unknown[]): ModuleResolveInstance;
}
