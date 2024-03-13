/* eslint-disable no-bitwise */
type BinaryNumber = number;

export type BinaryFlags = Record<string, BinaryNumber>;

/** Класс дающий возможность множественного выбора через бинарные ключи */
export class BinaryKeyFlag<BF extends BinaryFlags> {
  private state: number;

  protected getAllOn(): number {
    return this.or(Object.keys(this.allKeysAndFlags) as Array<keyof BF>);
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

  isOn(keys: Array<keyof BF>): boolean {
    return Boolean(keys.some((key) => this.state & this.allKeysAndFlags[key]));
  }

  protected or(keys: Array<keyof BF>): number {
    return keys.reduce((prev, curr) => prev | this.allKeysAndFlags[curr], 0);
  }
}
