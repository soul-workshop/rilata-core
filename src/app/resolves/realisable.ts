/** Объявляет интерфейс для получения объектов реализации модуля.
  Любые модули которые не являются репозиторием и фасадом. */
export interface Realisable {
  getRealisation(...args: unknown[]): unknown
}
