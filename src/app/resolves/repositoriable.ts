import { ModuleResolveInstance } from './types';

/** Объявляет интерфейс для получения объектов репозиториев модуля */
export interface Repositoriable {
  resolveRepo(...args: unknown[]): ModuleResolveInstance
}
