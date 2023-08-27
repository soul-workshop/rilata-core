import { stringUtility } from './string.utility';

describe('Тестирование класса StringUtility', () => {
  test('Метод trimChars', () => {
    const var1 = '  text   ';
    const var1Expect = var1;
    expect(stringUtility.trimChars(var1, '')).toBe(var1Expect);

    const var2 = '  text   ';
    const var2Expect = 'text';
    expect(stringUtility.trimChars(var2, ' ')).toBe(var2Expect);

    const var3 = '  text,   ';
    const var3Expect = 'text';
    expect(stringUtility.trimChars(var3, ' ,')).toBe(var3Expect);

    const var4 = '  ,text   ';
    const var4Expect = 'text';
    expect(stringUtility.trimChars(var4, ' ,')).toBe(var4Expect);

    const var5 = '! ! ,text   ';
    const var5Expect = 'text';
    expect(stringUtility.trimChars(var5, ' ,!')).toBe(var5Expect);

    const var6 = '! ! ,text ! text   ';
    const var6Expect = 'text ! text';
    expect(stringUtility.trimChars(var6, ' ,!')).toBe(var6Expect);

    const var7 = 'text1';
    const var7Expect = 'text';
    expect(stringUtility.trimChars(var7, '1')).toBe(var7Expect);

    const var8 = 'text1';
    const var8Expect = 'text1';
    expect(stringUtility.trimChars(var8, '2')).toBe(var8Expect);

    const var9 = 'text';
    const var9Expect = '';
    expect(stringUtility.trimChars(var9, var9)).toBe(var9Expect);
  });

  test('Метод makeFirstLetterUppercase', () => {
    expect(stringUtility.makeFirstLetterUppercase('иван'))
      .toBe('Иван');

    expect(stringUtility.makeFirstLetterUppercase('Иван'))
      .toBe('Иван');

    expect(stringUtility.makeFirstLetterUppercase(''))
      .toBe('');

    expect(stringUtility.makeFirstLetterUppercase('-а'))
      .toBe('-а');

    expect(stringUtility.makeFirstLetterUppercase('12'))
      .toBe('12');
  });
});
