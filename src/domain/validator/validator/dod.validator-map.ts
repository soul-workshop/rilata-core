import {
  AggregateAttrs, AggregateDOD, AggregateMeta,
  EntityAttrs, EntityDOD, EntityMeta,
  ValueObjectAttrs, ValueObjectDOD, ValueObjectMeta,
} from '../../domain-object-data/domain-objects';
import { GeneralDomainObjectData, GeneralOutputDOD } from '../../domain-object-data/types';
import { UUIDFormatFieldRule } from '../field-rules/prepared/strings-related/uuid-format.field-v-rule';
import { LiteralFieldValidator } from '../field-validator/literal.field-validator';
import { ValidatableLiteralTypeArray, ValidatableLiteralType } from '../types';
import { ValidatorMap } from './types';

type DODs = GeneralDomainObjectData
  | GeneralDomainObjectData[]
  | GeneralOutputDOD
  | GeneralOutputDOD[];

/**
 * Значением данного типа можно один раз определить правила валидации для полей DOD'а,
 * и потом в валидаторы полей команд и запросов импортировать из значений этого типа.
 */
export type DODValidatorMap<
  DOD extends GeneralDomainObjectData | GeneralOutputDOD,
> = {
  [K in keyof DOD['attrs']]-?: K extends 'meta'
    ? never
    : NonNullable<DOD['attrs'][K]> extends DODs
      ? NonNullable<DOD['attrs'][K]> extends GeneralDomainObjectData[] | GeneralOutputDOD[]
        ? DODValidatorMap<NonNullable<NonNullable<DOD['attrs'][K]>[number]>>
        : NonNullable<DOD['attrs'][K]> extends GeneralDomainObjectData | GeneralOutputDOD
          ? DODValidatorMap<NonNullable<DOD['attrs'][K]>>
          : NonNullable<DOD['attrs'][K]>
      : DOD['attrs'][K] extends ValidatableLiteralType | ValidatableLiteralTypeArray | undefined
        ? undefined extends DOD['attrs'][K]
          ? ValidatorMap<NonNullable<DOD['attrs'][K]>, false>
          : ValidatorMap<NonNullable<DOD['attrs'][K]>, true>
        : never
};

// #region Пример DODValidatorMap

const uuidFieldValidator: ValidatorMap<string> = new LiteralFieldValidator({
  isRequired: true,
  arrayConfig: { isArray: false },
  typeConfig: { type: 'string' },
  rules: [new UUIDFormatFieldRule()],
});

// DOD'ы
type MoneyDODAttrs = ValueObjectAttrs<{ count: number }>;
type MoneyDODMeta = ValueObjectMeta<MoneyDODAttrs, 'Money', []>;
type MoneyDOD = ValueObjectDOD<MoneyDODAttrs, MoneyDODMeta>;

type ChildDODAttrs = EntityAttrs<string, { money: MoneyDOD }>;
type ChildDODMeta = EntityMeta<ChildDODAttrs, 'Child', []>;
type ChildDOD = EntityDOD<ChildDODAttrs, ChildDODMeta>;

type PersonDODAttrs = AggregateAttrs<string, {
  phoneNumber?: number,
  children: ChildDOD[],
  nicknames: string[],
}>;
type PersonDODMeta = AggregateMeta<PersonDODAttrs, 'Person', []>;
type PersonDOD = AggregateDOD<PersonDODAttrs, PersonDODMeta>;

// DODValidatorMap'ы
const moneyDODValidatorMap: DODValidatorMap<MoneyDOD> = {
  count: new LiteralFieldValidator({
    isRequired: true,
    arrayConfig: { isArray: false },
    typeConfig: { type: 'number' },
    rules: [],
  }),
};

const childDODValidatorMap: DODValidatorMap<ChildDOD> = {
  id: uuidFieldValidator,
  money: moneyDODValidatorMap,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const personDODValidatorMap: DODValidatorMap<PersonDOD> = {
  id: uuidFieldValidator,
  phoneNumber: new LiteralFieldValidator({
    isRequired: false,
    arrayConfig: { isArray: false },
    typeConfig: { type: 'number' },
    rules: [],
  }),
  children: childDODValidatorMap,
  nicknames: new LiteralFieldValidator({
    isRequired: true,
    arrayConfig: { isArray: true },
    typeConfig: { type: 'string' },
    rules: [],
  }),
};
// #endregion
