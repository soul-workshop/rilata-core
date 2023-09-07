import { UuidType } from '../../common/types';

type AfterCommitCallback = () => Promise<void>;

/**
 * Класс, представляющий единицу работы.
 */
export class UnitOfWork {
  private afterCommitCallbacks: AfterCommitCallback[] = [];

  public readonly id: UuidType;

  constructor() {
    this.id = crypto.randomUUID();
  }

  /**
   * Получить экземпляр Unit of work текущего контекста.
   * @throws CurrentUnitOfWorkNotFound если в текущем контекте экземпляра
   *  unit of work нет.
   */
  static async getCurrent(): Promise<UnitOfWork> {
    throw Error('not implement');
  }

  /**
   * Зафиксирует единицу работы. Зафиксируется транзакция к БД.
   * @throws {AssertionException, OptimisticLockVersionMismatchError}
   */
  async commit(): Promise<void> {
    throw Error('not implement');
    // await this.resolver.getDataBase().commit();
    //
    // // Вызываем callbacks после коммита для публикации событии
    // await Promise.all(
    //   this.afterCommitCallbacks.map(
    //     (cb) => cb(),
    //   ),
    // );
  }

  /**
   * Откатывает единицу работы. Откатывает транзакция к БД.
   * @throws {AssertionException}
   */
  async rollback(): Promise<void> {
    throw Error('not implement');
    // await this.resolver.getDataBase().rollback();
  }

  registerAfterCommitCallbacks(cb: AfterCommitCallback): void {
    this.afterCommitCallbacks.push(cb);
  }

  async startTransaction(): Promise<void> {
    throw Error('not implement');
    // await this.resolver.getDataBase().startTransaction();
  }
}
