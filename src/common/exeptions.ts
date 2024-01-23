/** используется, если получили исключительную ситуацию которая говорит
    что в работе кода есть неполадки. */
export class AssertionException extends Error {}

/** не найде экземляр unitOfWork для текущего контекста */
export class CurrentUnitOfWorkNotFound extends Error {}

/** получили ошибку нессответствия оптимистичной блокировки */
export class OptimisticLockVersionMismatchError extends Error {}

/** любая ошибка при сохранении в БД кроме оптимистичной блокировки */
export class DatabaseObjectSavingError extends Error {}
