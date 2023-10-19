class NumberUtility {
  /** округляет число до необходимой разрядности.
      1. Если roundDigits > 0, то округление десятичной части.
      2. Если roundDigits < 0, то округление целой части.
   */
  round(value: number, roundDigits: number): number {
    const factor = 10 ** roundDigits;
    return Math.round(value * factor) / factor;
  }
}

export const numberUtility = Object.freeze(new NumberUtility());
