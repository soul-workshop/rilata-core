import { IdType } from '../../common/types';
import { dispositionTypeMap, mimeTypesMap } from './constants';

export type AnonymousUser = {
  type: 'AnonymousUser',
};

export type DomainUser = {
  type: 'DomainUser',
  userId: IdType,
};

export type ModuleCaller = {
  type: 'ModuleCaller',
  name: string,
  user: AnonymousUser | DomainUser,
};

export type Caller = ModuleCaller | AnonymousUser | DomainUser;

export type CallerType = Caller['type'];

export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  httpStatus: number,
  payload: FAIL,
} | {
  success: true,
  httpStatus: number,
  payload: SUCCESS,
};

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }

/**
 * MimeTypes - Типы MIME, поддерживаемые в системе. Определены в `mimeTypesMap`.
 */
export type MimeTypes = keyof typeof mimeTypesMap;

/**
 * DispositionTypes - Типы disposition для Content-Disposition заголовка.
 * Определены в `dispositionTypeMap`.
 */
export type DispositionTypes = keyof typeof dispositionTypeMap;

/**
 * ResponseFileOptions - Опции для создания ответа Response с файлом.
 * @property {MimeTypes} [mimeType] - Тип MIME для файла. По умолчанию 'json'.
 * @property {number} [status] - HTTP статус для ответа. По умолчанию 200.
 * @property {BufferEncoding} [encode] - Кодировка для чтения файла. По умолчанию 'utf8'.
 * @property {boolean} [shouldZip] - Указывает, следует ли сжимать файл в zip. По умолчанию true.
 * @property {DispositionTypes} [disposition] - Значение для Content-Disposition заголовка.
   По умолчанию 'inline'.
 */
export type ResponseFileOptions = {
  mimeType?: MimeTypes, // default 'json'
  status?: number, // default 200
  encode?: BufferEncoding, // default 'utf8'
  shouldZip?: boolean, // default true
  disposition?: DispositionTypes // default inline
}
