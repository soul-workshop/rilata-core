export interface Logger {
  /** Различная информация о работе приложения */
  info(log: string): Promise<void>

  /** Не критичные предупреждения */
  warning(log: string, logAttrs?: unknown): Promise<void>

  /** Утверждения, если условие ложно, то запишется fatalError */
  assert(condition: boolean, log: string, logAttrs?: unknown): Promise<void>

  /** Ошибки программы которые выявляются в ходе проверок в коде */
  error(log: string, logAttrs?: unknown, err?: Error): Promise<Error>

  /** Фатальные ошибки, которые ловятся обработчиком на верхнем уровне */
  fatalError(log: string, logAttrs?: unknown, err?: Error): Promise<Error>
}
