/* eslint-disable default-param-last */
export class StringUtility {
  /**
   * Обрезать строку вырезав с обоих сторон переданные символы.
   */
  trim(target: string, chars = ' \t\v'): string {
    return this.trimStart(this.trimEnd(target, chars), chars);
  }

  /**
   * Обрезать строку вырезав с начала строки переданные символы (по умолчанию пробельные символы).
   */
  trimStart(target: string, chars = ' \t\v'): string {
    let start = 0;
    const end = target.length;
    while (start < end && chars.indexOf(target[start]) >= 0) { start += 1; }
    return (start > 0 || end < target.length) ? target.substring(start, end) : target;
  }

  /**
   * Обрезать строку вырезав с конца строки переданные символы (по умолчанию пробельные символы).
   */
  trimEnd(target: string, chars = ' \t\v'): string {
    const start = 0;
    let end = target.length;
    while (end > start && chars.indexOf(target[end - 1]) >= 0) { end -= 1; }
    return (start > 0 || end < target.length) ? target.substring(start, end) : target;
  }

  makeFirstLetterUppercase(str: string): string {
    return str.length > 0
      ? str[0].toUpperCase() + str.substring(1)
      : str;
  }

  camelCaseToKebab(text: string): string {
    return this.camelToSnakeKebabCase(text, '-', false);
  }

  camelCaseToSuperKebab(text: string): string {
    return this.camelToSnakeKebabCase(text, '-', true);
  }

  camelCaseToSnake(text: string): string {
    return this.camelToSnakeKebabCase(text, '_', false);
  }

  camelCaseToSuperSnake(text: string): string {
    return this.camelToSnakeKebabCase(text, '_', true);
  }

  camelToSnakeKebabCase(text: string, caseChar = '-', isSuper: boolean): string {
    if (text === '') return '';
    const cb = (prev: string, curr: string): string => prev + (this.isTitle(curr)
      ? `${caseChar}${curr.toLowerCase()}`
      : curr
    );
    return isSuper
      ? this.reduce(text.substring(1), cb, text[0].toLowerCase())
      : this.reduce(text, cb);
  }

  kebabToCamelCase(text: string): string {
    return this.snakeKebabToCamelCase(text, '-', false);
  }

  kebabToSuperCamelCase(text: string): string {
    return this.snakeKebabToCamelCase(text, '-', true);
  }

  snakeToCamelCase(text: string): string {
    return this.snakeKebabToCamelCase(text, '_', false);
  }

  snakeToSuperCamelCase(text: string): string {
    return this.snakeKebabToCamelCase(text, '_', true);
  }

  snakeKebabToCamelCase(text: string, char = '-', isSuper: boolean): string {
    if (text === '') return '';
    const cb = (prev: string, curr: string): string => ((prev[prev.length - 1] === char)
      ? prev.substring(0, prev.length - 1) + curr.toUpperCase()
      : prev + curr);

    return isSuper
      ? this.reduce(text.substring(1), cb, text[0].toUpperCase())
      : this.reduce(text, cb);
  }

  reduce(text: string, cb: (prev: string, char: string) => string): string

  reduce(text: string, cb: (prev: string, char: string) => string, initial: string): string

  reduce<S>(text: string, cb: (prev: S, char: string) => S, initial: S): S

  reduce<S>(text: string, cb: (prev: S, char: string) => S, initial?: S): S {
    if (text === '' && initial !== undefined) return initial as S;
    if (text === '') return '' as S;

    let total; let
      iter;
    if (initial === undefined) {
      [total] = text as string;
      iter = (text as string).substring(1);
    } else {
      total = initial;
      iter = (text as string);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const char of iter) {
      total = cb(total as S, char);
    }

    return total as S;
  }

  protected isTitle(char: string): boolean {
    return char >= 'A' && char <= 'Z';
  }
}

export const stringUtility = Object.freeze(new StringUtility());
