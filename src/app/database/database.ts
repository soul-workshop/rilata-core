export interface Database {
  init(...args: unknown[]): Promise<void>

  startTransaction(): Promise<unknown>

  commit(): Promise<unknown>

  rollback(): Promise<unknown>
}
