import { ErrorDod } from '../../domain/domain-data/domain-types';

export type IncorrectTokenBody = {
  text: 'Невозможно расшифровать токен. Токен имеет не верный формат.',
  hint: Record<string, never>,
  name: 'IncorrectTokenError',
};

/** Некорректный тип токена. */
export type IncorrectTokenError = ErrorDod<'IncorrectTokenError', IncorrectTokenBody>

export type NotValidTokenPayloadBody = {
    text: 'Невалидная полезная нагрузка в токене.',
    hint: Record<string, never>,
    name: 'NotValidTokenPayloadError',
};
/** Невалидная полезная нагрузка в токене. */
export type NotValidTokenPayloadError = ErrorDod<'NotValidTokenPayloadError', NotValidTokenPayloadBody>

export type TokenExpiredErrorBody = {
    text: 'Токен просрочен.',
    hint: Record<string, never>,
    name: 'TokenExpiredError',
};
/** Токен просрочен. */
export type TokenExpiredError = ErrorDod<'TokenExpiredError', TokenExpiredErrorBody>;

export type JwtErrors = IncorrectTokenError | NotValidTokenPayloadError | TokenExpiredError;
