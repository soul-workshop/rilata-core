import { ErrorDod } from '../../domain/domain-object-data/common-types';

export type TelegramHashNotValidBody = {
    text: 'Хэш телеграмма некорректный',
    hint:{
        hash: string,
    }
}

export type TelegramHashNotValidError = ErrorDod<TelegramHashNotValidBody, 'TelegramHashNotValidError'>

export type TelegramAuthDateNotValidError = {
    text: 'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
    hint:{
        authHashLifetimeAsSeconds: number,
    }
}

export type TelegramDateNotValidError = ErrorDod<TelegramAuthDateNotValidError, 'TelegramAuthDateNotValidError'>
