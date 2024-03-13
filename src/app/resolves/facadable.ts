import { ModuleResolveInstance } from './types';

/** Объявляет интерфейс для получения объектов фасадов других модулей */
export interface Facadable {
  getFacade(...args: unknown[]): ModuleResolveInstance;
}
