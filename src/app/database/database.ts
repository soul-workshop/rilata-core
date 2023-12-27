export interface Database {
  init(...args: unknown[]): Promise<void>

  startTransaction(...args: unknown[]): Promise<unknown>

  commit(...args: unknown[]): Promise<unknown>

  rollback(...args: unknown[]): Promise<unknown>
}
