class SetUtils {
  difference<T>(
    a: Readonly<Set<T>>,
    b: Readonly<Set<T>>,
  ): Set<T> {
    return new Set([...a.values()].filter((x) => !b.has(x)));
  }

  intersection<T>(
    a: Readonly<Set<T>>,
    b: Readonly<Set<T>>,
  ): Set<T> {
    return new Set([...a.values()].filter((x) => b.has(x)));
  }

  union<T>(
    a: Readonly<Set<T>>,
    b: Readonly<Set<T>>,
  ): Set<T> {
    const res = new Set(a.values());
    b.forEach((value) => {
      res.add(value);
    });
    return res;
  }

  join<T>(tableOfT: T[][]): Set<T> {
    const res: Set<T> = new Set();
    tableOfT.forEach((rowOfT) => rowOfT.forEach((t) => res.add(t)));
    return res;
  }
}

export const setUtils = new SetUtils();
