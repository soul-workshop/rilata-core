import { TokenType } from './types';
import { ErrorDod } from '../../domain/domain-data/domain-types';

export type IncorrectTokenTypeBody = {
  text: 'Некорректный тип токена авторизации',
  hint: {
    rawToken: string,
    expectedType: TokenType,
    givenType: TokenType,
  },
  name: 'IncorrectTokenTypeError',
};
/** Некорректный тип токена. */
export type IncorrectTokenTypeError = ErrorDod<'IncorrectTokenTypeError', IncorrectTokenTypeBody>

export type NotValidTokenPayloadBody = {
    text: 'Невалидная полезная нагрузка в токене.',
    hint: {
        rawToken: string,
    },
    name: 'NotValidTokenPayloadError',
};
/** Невалидная полезная нагрузка в токене. */
export type NotValidTokenPayloadError = ErrorDod<'NotValidTokenPayloadError', NotValidTokenPayloadBody>

export type NotBeforeErrorBody = {
    text: 'Время работы токена ещё не наступило.',
    hint: {
        rawToken: string,
    },
    name: 'NotBeforeError',
};
/** Время работы токена ещё не наступило. */
export type NotBeforeError = ErrorDod<'NotBeforeError', NotBeforeErrorBody>;

export type TokenExpiredErrorBody = {
    text: 'Токен просрочен.',
    hint: {
        rawToken: string,
    },
    name: 'TokenExpiredError',
};
/** Токен просрочен. */
export type TokenExpiredError = ErrorDod<'TokenExpiredError', TokenExpiredErrorBody>;

export type JsonWebTokenErrorBody = {
    text: 'Общая ошибка токена. Неуспешное действие.',
    hint: {
        rawToken: string,
    },
    name: 'JsonWebTokenError',
};
/** Общая ошибка токена. Неуспешное действие. */
export type JsonWebTokenError = ErrorDod<'JsonWebTokenError', JsonWebTokenErrorBody>;

export type VerifyTokenError = IncorrectTokenTypeError | NotValidTokenPayloadError
  | NotBeforeError | TokenExpiredError | JsonWebTokenError;

export type InvalidTokenBody = {
    text: 'Невозможно расшифровать токен. Токен имеет не верный формат.',
    hint: {
        rawToken?: string,
    },
    name: 'InvalidTokenError',
};
/** Невозможно расшифровать токен: токен имеет не верный формат. */
export type InvalidTokenError = ErrorDod<'InvalidTokenError', InvalidTokenBody>;
