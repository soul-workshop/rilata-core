/** Текст для пользователя с переменными переданными в hint.
  В тексте можно указывать значения "переменных" в формате {{hintKey}}.
  Сделано для поддержки перевода в будущем.
  Пример: validationError = {
    text: 'Значение должно быть больше {{min}} и меньше {{max}}',
    hint: { min: 18, max: 65 }
  }
*/
export type Locale = {
  text: string,
  hint?: Record<string, unknown>,
}
