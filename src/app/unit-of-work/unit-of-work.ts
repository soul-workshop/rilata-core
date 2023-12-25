import { Databaseable } from '../resolves/databaseable';

type AfterCommitCallback = () => Promise<void>;

/** инкапсулирет всю логику глобальной транзакции, а также позволяет
    кэшировать данные полученные в данном потоке запроса. */
export class UnitOfWork {
  private afterCommitCallbacks: AfterCommitCallback[] = [];

  private threadCache: Record<string, unknown> = {};

  constructor(protected resolver: Databaseable) {}

  /** запускает головную транзакцию */
  async startTransaction(): Promise<void> {
    await this.resolver.getDatabase().startTransaction();
  }

  /**
   * Зафиксирует единицу работы. Зафиксируется транзакция к БД.
   * @throws {AssertionException, OptimisticLockVersionMismatchError}
   */
  async commit(): Promise<void> {
    await this.resolver.getDatabase().commit();

    // Вызываем callbacks после коммита для публикации событии
    await Promise.all(
      this.afterCommitCallbacks.map(
        (cb) => cb(),
      ),
    );
  }

  /**
   * Откатывает единицу работы. Откатывает транзакция к БД.
   * @throws {AssertionException}
   */
  async rollback(): Promise<void> {
    await this.resolver.getDatabase().rollback();
  }

  /** добавить данные в кэш потока */
  addToThreadCache(key: string, value: unknown): void {
    this.threadCache[key] = value;
  }

  /** получить данные из кэша потока */
  getFromThreadCache<T>(key: string): T | undefined {
    return this.threadCache[key] as T;
  }
}
