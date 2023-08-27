export function difference<T>(
  a: Readonly<Set<T>>,
  b: Readonly<Set<T>>,
): Set<T> {
  return new Set([...a.values()].filter((x) => !b.has(x)));
}

export function intersection<T>(
  a: Readonly<Set<T>>,
  b: Readonly<Set<T>>,
): Set<T> {
  return new Set([...a.values()].filter((x) => b.has(x)));
}

export function union<T>(
  a: Readonly<Set<T>>,
  b: Readonly<Set<T>>,
): Set<T> {
  const res = new Set(a.values());
  b.forEach((value) => {
    res.add(value);
  });
  return res;
}
