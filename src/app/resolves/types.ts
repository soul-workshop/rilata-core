import { GeneralModuleResolver } from '../module/types';

export interface ModuleResolveInstance {
  /** Вызывается при необходимости в момент начальной инициализации
    сервера соответвующим объектом moduleResolver. */
  init(resolver: GeneralModuleResolver): void
}
