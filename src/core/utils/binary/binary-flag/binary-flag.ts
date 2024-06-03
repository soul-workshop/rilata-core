/* eslint-disable no-bitwise */
type BinaryNumber = number;

export type BinaryFlags = Record<string, BinaryNumber>;

/** Класс дающий возможность множественного выбора через бинарные ключи */
export class BinaryKeyFlag<BF extends BinaryFlags> {
  private state: number;

  /** Возвращает ключи соответствующие переданному числу. */
  static getFlagKeys<BF extends BinaryFlags>(allKeysAndFlags: BF, num: number): (keyof BF)[] {
    const keys: string[] = [];
    Object.entries(allKeysAndFlags).forEach(([key, value]) => {
      if ((value & num) !== 0) keys.push(key);
    });
    return keys as unknown as (keyof BF)[];
  }

  /** @params {string} allKeysAndFlags Все значения ключей и значений.
      Ключи: обычный текст дающий понятной семантической описание.
      Значение: битовое число для данного ключа.
    @params {string[]} keys Ключи которые необходимо включить.
  */
  constructor(protected allKeysAndFlags: BF, keys: Array<keyof BF> | 'off' | 'all') {
    if (keys === 'all') this.state = this.getAllOn();
    else if (keys === 'off') this.state = 0;
    else this.state = this.or(keys);
  }

  isAny(keys: Array<keyof BF>): boolean {
    return Boolean(keys.some((key) => this.state & this.allKeysAndFlags[key]));
  }

  isAll(keys: Array<keyof BF>): boolean {
    return Boolean(keys.every((key) => this.state & this.allKeysAndFlags[key]));
  }

  protected or(keys: Array<keyof BF>): number {
    return keys.reduce((prev, curr) => prev | this.allKeysAndFlags[curr], 0);
  }

  protected getAllOn(): number {
    return this.or(Object.keys(this.allKeysAndFlags) as Array<keyof BF>);
  }
}
