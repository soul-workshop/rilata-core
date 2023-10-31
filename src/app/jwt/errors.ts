import { TokenType } from './types';
import { ErrorDod } from '../../domain/domain-object-data/common-types';

export type IncorrectTokenTypeBody = {
  text: 'Некорректный тип токена авторизации',
  hint: {
    rawToken: string,
    expectedType: TokenType,
    givenType: TokenType,
  }
};
/** Некорректный тип токена. */
export type IncorrectTokenTypeError = ErrorDod<IncorrectTokenTypeBody, 'IncorrectTokenTypeError'>

export type NotValidTokenPayloadBody = {
    text: 'Невалидная полезная нагрузка в токене.',
    hint: {
        rawToken: string,
    }
};
/** Невалидная полезная нагрузка в токене. */
export type NotValidTokenPayloadError = ErrorDod<NotValidTokenPayloadBody, 'NotValidTokenPayloadError'>

export type NotBeforeErrorBody = {
    text: 'Время работы токена ещё не наступило.',
    hint: {
        rawToken: string,
    }
};
/** Время работы токена ещё не наступило. */
export type NotBeforeError = ErrorDod<NotBeforeErrorBody, 'NotBeforeError'>;

export type TokenExpiredErrorBody = {
    text: 'Токен просрочен.',
    hint: {
        rawToken: string,
    }
};
/** Токен просрочен. */
export type TokenExpiredError = ErrorDod<TokenExpiredErrorBody, 'TokenExpiredError'>;

export type JsonWebTokenErrorBody = {
    text: 'Общая ошибка токена. Неуспешное действие.',
    hint: {
        rawToken: string,
    }
};
/** Общая ошибка токена. Неуспешное действие. */
export type JsonWebTokenError = ErrorDod<JsonWebTokenErrorBody, 'JsonWebTokenError'>;

export type VerifyTokenError = IncorrectTokenTypeError | NotValidTokenPayloadError
  | NotBeforeError | TokenExpiredError | JsonWebTokenError;

export type InvalidTokenBody =
  {
    text: 'Невозможно расшифровать токен. Токен имеет не верный формат.',
    hint: {
        rawToken: string,
    }
};
/** Невозможно расшифровать токен: токен имеет не верный формат. */

/** Некорректный хэш телеграмма */
export type InvalidTokenError = ErrorDod<InvalidTokenBody, 'InvalidTokenError'>;

export type TelegramHashErrorBody = {
    text: 'Хэш телеграмма некорректный',
    hint:{
        hash: string,
    }
}

/** Auth_date телеграмма устарел, должно быть не менее 7 дней */
export type TelegramDtoError = ErrorDod<TelegramHashErrorBody, 'TelegramHashErrorBody'>

export type TelegramAuthDateError = {
    text: 'auth_date больше 7 дней',
    hint:{
        auth_date:string,
    }
}
