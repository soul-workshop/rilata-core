/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { Caller } from '../../app/caller';
import { ExcludeDeepDtoAttrs, GetDomainAttrsDotKeys } from '../../common/type-functions';
import { UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';
import { AggregateRootDataTransfer, GeneralARDTransfer } from './aggregate-data-types';

type Name = string;

/** Domain Object Data */
export type DomainAttrs = DTO;

export type ObjectType = 'value-object' | 'entity' | 'aggregate';

export type DomainType = 'domain-object' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error';

export type DomainMeta<
  NAME extends string,
  D_TYPE extends DomainType = 'domain-object',
  O_TYPE extends ObjectType = 'aggregate',
> = {
  name: NAME,
  domainType: D_TYPE,
  objectType: O_TYPE,
  // version?: number,
}

export type GeneralDomainMeta = DomainMeta<string, DomainType, ObjectType>;

export type ErrorDod<
  LOCALE extends Locale,
  NAME extends string,
  TYPE extends ErrorType = 'domain-error'
> = {
  locale: LOCALE,
  name: NAME,
  domainType: 'error',
  errorType: TYPE,
}

export type GeneralErrorDod = ErrorDod<Locale, Name, ErrorType>;

export type EventDod<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  name: NAME,
  domainType: 'event',
  eventId: UuidType,
  caller: Caller,
}

export type GeneralEventDod = EventDod<DomainAttrs, Name>;

export type ActionDod = {
  actionName: string,
  body: DTO,
}

export type GetDomainAttrs<D extends GeneralARDTransfer> =
  D extends AggregateRootDataTransfer<infer A, infer _> ? A : never;

/** Определяет все данные необходимые для взаимодействия с пользователем.
  @property {string} label - имя поля. Например: "Тип фиксации",
  @property {string} attributeDescription - текст объясняющий для чего необходимо ввести данную информацию,
    а также неочевидные но важные с точки зрения объектной модели и предметной области понятия.
    Например:
      Поле "Тип фиксации" очень важная информация для алгоритма приложения.
      Она участвует в вычислениях рейтингов, в постороении аналитики за день и прочее.
      Каждая ваша фиксация имеет значение, делайте их осознанно.
  @property {string} [placeHolder] - текст объясняющий что нужно сделать пользователю.
    Например: "Выберите тип фиксации"
  @property {unknown[]} [choice] - введите массив значений который может принимать данное свойство.
    Например: ['Признание', 'Без нарушений', 'Рекомендация', 'Замечание', 'Нарушение', 'Значительное нарушение'].
  @property {unknown} [additional] - какая то дополнительная информация, например описания типов фиксации.
  {
    Признание: {
      description: 'Подрядчик предвосхитил ваши ожидания и вы хотите поощрить его за работу./nДополнительно: Дает плюс в рейтинг обеих сторон.',
      placeHolder: 'Введите описание, что именно предвосхитило ваши ожидания'
    }
    Без нарушений: {
      description: 'Зафиксировать текущий ход работ.',
    }
    Предложение: {
      description: 'Инициация обсуждения которое может привести к улучшению эффективности работ./nДополнительно: Дает плюс в рейтинг для инициатора.',
      placeHolder: Введите ваше предложение и какое улучшение это даст.
    }
    Рекомендация: {
      description: 'Рекомендация к работе которую необходимо учитывать в будущих работах.',
      placeHolder: 'Введите вашу рекомендацию к будущим работам',
    }
    Замечание: {
      description: 'Некритичное нарушение которое необходимо устранить.',
      placeHolder: 'Введите что нужно исправить'
    }
    Нарушение: {
      description: 'Критичное нарушение которое необходимо устранить в приоритетном порядке./nДополнительно: Дает минус в рейтинг исполнителя.',
      placeHolder: 'Введите что нужно исправить'
    }
    Значительное нарушение: {
      description: 'Критичное нарушение которое необходимо рассмотреть отдельной группой (менеджерами, руководством, комиссией)./nДополнительно: Дает двойной минус в рейтинг исполнителя.',
      placeHolder: 'Введите, что нужно рассмотреть (расследовать).'
    }
  }
*/
type AttrsInfo = {
  label: string,
  attributeDescription: string,
  placeHolder?: string,
  default?: string,
  choice?: unknown[],
  additional?: unknown,
}

type DomainInfo<DTO_TYPE extends DTO> = {
  name: string,
  pluralName: string,
  domainMap: DomainMap<DTO_TYPE>
}

export type DomainMap<DTO_TYPE extends DTO> = {
  [KEY in keyof DTO_TYPE & string]-?: NonNullable<DTO_TYPE[KEY]> extends Array<infer ARR_TYPE>
    ? NonNullable<ARR_TYPE> extends DTO
      ? DomainInfo<NonNullable<ARR_TYPE>>
      : AttrsInfo
    : NonNullable<DTO_TYPE[KEY]> extends DTO
      ? DomainInfo<NonNullable<DTO_TYPE[KEY]>>
      : AttrsInfo
}

export type AggregateDomainMap<AGG_ATTRS extends DTO> = DomainInfo<AGG_ATTRS>;

export type OutputDA<
  ATTRS extends DomainAttrs,
  EXC extends GetDomainAttrsDotKeys<ATTRS>
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;
