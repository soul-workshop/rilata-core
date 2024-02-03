export type ModuleType = 'command-module' | 'read-module' | 'common-module';

export type ModuleConfig = {
  /** url контроллера данного модуля */
  url: string,

  /** путь к файлу eventDeliver данного модуля */
  eventDelivererPath: string,
}
