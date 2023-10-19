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
      ? str[0].toUpperCase() + str.slice(1, str.length)
      : str;
  }
}

export const stringUtility = Object.freeze(new StringUtility());
