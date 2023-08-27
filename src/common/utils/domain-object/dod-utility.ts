/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GeneralAggregateDOD, GeneralEntityDOD, GeneralValueObjectDOD,
  GeneralEventDOD, GeneralDomainErrorDOD, GeneralAppErrorDOD,
  GeneralReadModelDOD, GeneralAggregateAttrs, GeneralEntityAttrs,
  GeneralAggregateMeta, AggregateVersion, GeneralEventAttrs, ArrayErrorDOD, arrayErrorName,
} from '../../../domain/domain-object-data/domain-objects';
import {
  DODAttrs, ErrorType, GeneralDomainObjectData, GetDODFromOutput,
  OutputDomainObjectData,
} from '../../../domain/domain-object-data/types';
import { DTO } from '../../dto';
import { AssertionException } from '../../exceptions';
import { LiteralWithUndefined } from '../../types';
import { dtoUtility } from '../dto';

/** Утилита для работы с объектами DomainObjectData */
class DodUtility {
  /** Возвращает DOD без полей NotOutputAttrs */
  getOutput<DOD extends GeneralDomainObjectData>(dod: DOD): OutputDomainObjectData<DOD> {
    const attrsWithExcludedAttrs = dtoUtility.excludeAttrs(
      dtoUtility.deepCopy(dod.attrs),
      dod.meta.noOutputAttrs,
    );
    this.convertNestedDODsToOutputs(attrsWithExcludedAttrs);

    let metaWithExcludedAttrs = dtoUtility.excludeAttrs(
      dtoUtility.deepCopy(dod.meta),
      'noOutputAttrs',
    );

    if (dod.meta.objectType === 'aggregate') {
      metaWithExcludedAttrs = dtoUtility.excludeAttrs(
        metaWithExcludedAttrs as GeneralAggregateMeta,
        'version',
      );
    }

    const metaWithExcludedAttrsAndWithOutputAttr = dtoUtility.extendAttrs(
      metaWithExcludedAttrs,
      { output: true },
    );

    return {
      attrs: attrsWithExcludedAttrs,
      meta: metaWithExcludedAttrsAndWithOutputAttr,
    } as OutputDomainObjectData<DOD>;
  }

  /**
   * Преобразовать DOD-атрибуты входящего параметра в OutputDOD'ы.
   * Поддерживает вложенные преобразования.
   * Функция с побочным эффектом.
   * */
  private convertNestedDODsToOutputs(dodAttrs: DODAttrs): void {
    Object.keys(dodAttrs).forEach((key) => {
      const value = dodAttrs[key];
      if (this.isDOD(value)) {
        dodAttrs[key] = this.getOutput(value);
      } else if (Array.isArray(value)) {
        if ((value as []).every((v) => this.isDOD(v))) {
          dodAttrs[key] = value.map((v) => this.getOutput(v as GeneralDomainObjectData));
        }
      }
    });
  }

  /** Возвращает данные доменного объекта агрегата */
  getAggregate<DOD extends GeneralAggregateDOD>(
    aggregateName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    version: AggregateVersion,
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: aggregateName,
        objectType: 'aggregate',
        domainType: 'object',
        noOutputAttrs,
        version,
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта сущности */
  getEntity<DOD extends GeneralEntityDOD>(
    entityName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: entityName,
        objectType: 'entity',
        domainType: 'object',
        noOutputAttrs,
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта объекта-значения */
  getValueObject<DOD extends GeneralValueObjectDOD>(
    objectName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: objectName,
        objectType: 'value-object',
        domainType: 'object',
        noOutputAttrs,
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта события */
  getEvent<DOD extends GeneralEventDOD>(
    eventName: DOD['meta']['name'],
    eventGroup: DOD['meta']['group'],
    attrs: DOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: eventName,
        group: eventGroup,
        objectType: 'value-object',
        domainType: 'event',
        noOutputAttrs,
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта доменной ошибки */
  getDomainError<DOD extends GeneralDomainErrorDOD>(
    errorName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: errorName,
        objectType: 'value-object',
        domainType: 'error',
        errorType: 'domain-error',
        noOutputAttrs: [] as unknown as DOD['meta']['noOutputAttrs'],
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта ошибки уровня приложения */
  getAppError<
    DOD extends GeneralAppErrorDOD,
  >(
    errorName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: errorName,
        objectType: 'value-object',
        domainType: 'error',
        errorType: 'app-error',
        noOutputAttrs: [] as unknown as DOD['meta']['noOutputAttrs'],
      },
    } as DOD;
  }

  /** Возвращает данные доменного объекта модели чтения */
  getReadModel<DOD extends GeneralReadModelDOD>(
    readModelName: DOD['meta']['name'],
    attrs: DOD['attrs'],
    copy = true,
  ): DOD {
    return {
      attrs: copy ? dtoUtility.deepCopy(attrs) : attrs,
      meta: {
        name: readModelName,
        objectType: 'read-model',
        domainType: 'object',
        noOutputAttrs: [],
      },
    } as DOD;
  }

  isError(obj: Record<string, any>): obj is GeneralDomainErrorDOD | GeneralAppErrorDOD {
    if ('meta' in obj) {
      if ('errorType' in obj.meta) {
        if (obj.meta.errorType === 'app-error' || obj.meta.errorType === 'domain-error') {
          return true;
        }
      }
    }
    return false;
  }

  isDOD(value: DTO | LiteralWithUndefined): value is GeneralDomainObjectData {
    if (Array.isArray(value) || typeof value !== 'object') return false;
    return 'attrs' in value && 'meta' in value
      && 'domainType' in value.meta && 'objectType' in value.meta;
  }

  /**
   * Возвращает выходные данные доменного объекта агрегата.
   *
   * Примечание: хотя noOutputAttrs для "output" можно и не принимать как аргумент,
   * но для уверенности, что не output атрибуты не попадут во вне они принимаются
   * и отсекаются. Такое может возникнуть, т.к. типизация структурная, и можно
   * случайно передать ранее собранные атрибуты агрегата, где будут сидеть
   * и обычные и приватные атрибуты.
   */
  getOutputAggregate<
    ODOD extends OutputDomainObjectData<GeneralAggregateDOD>,
    DOD extends GeneralAggregateDOD = GetDODFromOutput<ODOD>,
  >(
    aggregateName: ODOD['meta']['name'],
    attrs: ODOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): ODOD {
    const aggrWithoutNoOutAttrs = DODUtility.getAggregate(
      aggregateName,
      attrs as GeneralAggregateAttrs,
      -1,
      noOutputAttrs,
      copy,
    );
    return DODUtility.getOutput(aggrWithoutNoOutAttrs) as ODOD;
  }

  /** Возвращает выходные данные доменного объекта сущности */
  getOutputEntity<
    ODOD extends OutputDomainObjectData<GeneralEntityDOD>,
    DOD extends GeneralEntityDOD = GetDODFromOutput<ODOD>
  >(
    entityName: ODOD['meta']['name'],
    attrs: ODOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): ODOD {
    const entityWithoutNoOutAttrs = DODUtility.getEntity(
      entityName,
      attrs as GeneralEntityAttrs,
      noOutputAttrs,
      copy,
    );
    return DODUtility.getOutput(entityWithoutNoOutAttrs) as ODOD;
  }

  /** Возвращает выходные данные доменного объекта объекта-значения */
  getOutputValueObject<
    ODOD extends OutputDomainObjectData<GeneralValueObjectDOD>,
    DOD extends GeneralValueObjectDOD = GetDODFromOutput<ODOD>
  >(
    objectName: ODOD['meta']['name'],
    attrs: ODOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): ODOD {
    const objectWithoutNoOutAttrs = DODUtility.getValueObject(
      objectName,
      attrs,
      noOutputAttrs,
      copy,
    );
    return DODUtility.getOutput(objectWithoutNoOutAttrs) as ODOD;
  }

  /** Возвращает выходные данные доменного объекта события */
  getOutputEvent<
    ODOD extends OutputDomainObjectData<GeneralEventDOD>,
    DOD extends GeneralEventDOD = GetDODFromOutput<ODOD>
  >(
    eventName: ODOD['meta']['name'],
    groupName: ODOD['meta']['group'],
    attrs: ODOD['attrs'],
    noOutputAttrs: DOD['meta']['noOutputAttrs'],
    copy = true,
  ): ODOD {
    const eventWithoutNoOutAttrs = DODUtility.getEvent(
      eventName,
      groupName,
      attrs as GeneralEventAttrs,
      noOutputAttrs,
      copy,
    );
    return DODUtility.getOutput(eventWithoutNoOutAttrs) as ODOD;
  }

  /** Возвращает выходные данные доменного объекта доменной ошибки */
  getOutputDomainError<
    ODOD extends OutputDomainObjectData<GeneralDomainErrorDOD>,
  >(
    errorName: ODOD['meta']['name'],
    attrs: ODOD['attrs'],
    copy = true,
  ): ODOD {
    const errorWithoutNoOutAttrs = DODUtility.getDomainError(
      errorName,
      attrs,
      copy,
    );
    return DODUtility.getOutput(errorWithoutNoOutAttrs) as ODOD;
  }

  /** Возвращает выходные данные доменного объекта ошибки уровня приложения */
  getOutputAppError<
    ODOD extends OutputDomainObjectData<GeneralAppErrorDOD>,
  >(
    errorName: ODOD['meta']['name'],
    attrs: ODOD['attrs'],
    copy = true,
  ): ODOD {
    const errorWithoutNoOutAttrs = DODUtility.getAppError(
      errorName,
      attrs,
      copy,
    );
    return DODUtility.getOutput(errorWithoutNoOutAttrs) as ODOD;
  }

  getArrayError<DOD extends GeneralDomainErrorDOD | GeneralAppErrorDOD>(
    dods: DOD[],
    copy = false,
  ): ArrayErrorDOD<DOD> {
    if (dods.length === 0) {
      throw new AssertionException('При вызове DodUtility.getArrayError передано пустой массив');
    };
    if (dods[0].meta.errorType === 'app-error') {
      return this.getAppError(
        arrayErrorName,
        {
          dods,
        },
        copy,
      ) as unknown as ArrayErrorDOD<DOD>;
    } else {
      return this.getDomainError(
        arrayErrorName,
        {
          dods,
        },
        copy,
      ) as unknown as ArrayErrorDOD<DOD>;
    }
  }
}

export const DODUtility = Object.freeze(new DodUtility());
