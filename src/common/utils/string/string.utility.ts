export class StringUtility {
  /**
   * Обрезать строку с обоих сторон, вырезав оттуда переданные символы.
   */
  trimChars(target: string, chars: string): string {
    let start = 0;
    let end = target.length;
    while (start < end && chars.indexOf(target[start]) >= 0) { start += 1; }
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
