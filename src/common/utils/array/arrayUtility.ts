class ArrayUtility {
  /**
  * Перемешивает массив рандомным образом.
  * @param a
  */
  shuffle<T>(a: Readonly<Array<T>>): Array<T> {
    const aCopy = [...a];
    let j; let x; let
      i;
    // eslint-disable-next-line no-plusplus
    for (i = aCopy.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = aCopy[i];
      aCopy[i] = aCopy[j];
      aCopy[j] = x;
    }
    return aCopy;
  }

  /**
  * Создает новый массив, объединяя соответствующие элементы массива в кортеж(zip как в python-e)
  * Если у массивов разные длины, не достающие элементы заполняет как undefined
  * @param array1
  * @param array2
  * @returns
  */
  zip<T, B>(array1: Readonly<Array<T>>, array2: Readonly<Array<B>>): Array<[T, B]> {
    return Array.from(
      Array(
        Math.max(array1.length, array2.length),
      ),
      (value, index) => [array1[index], array2[index]],
    );
  }

  /** Возвращает новый массив удалив повторяющиеся значения */
  removeDuplicateValues<T extends unknown[]>(arr: T): T {
    const other: unknown[] = [];
    arr.forEach((value) => { if (!other.includes(value)) other.push(value); });
    return other as T;
  }

  /** Проверяет одинаковы ли значения массивов */
  arrayValuesAreEqual(a: unknown[], b: unknown[]): boolean {
    return a.length === b.length && a.every((value) => b.includes(value));
  }

  /** Првоеряет одинаковы ли значения массивов, предварительно удалив повторения значении */
  arraysEqualAsSet(a: unknown[], b: unknown[]): boolean {
    return this.arrayValuesAreEqual(
      this.removeDuplicateValues(a),
      this.removeDuplicateValues(b),
    );
  }

  getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export const arrayUtility = Object.freeze(new ArrayUtility());
