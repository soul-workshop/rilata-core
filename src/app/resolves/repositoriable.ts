import { ModuleResolveInstance } from './types';

/** Объявляет интерфейс для получения объектов репозиториев модуля */
export interface Repositoriable {
  getRepository(...args: unknown[]): ModuleResolveInstance
}
