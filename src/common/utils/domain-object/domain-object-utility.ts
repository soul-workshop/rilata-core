import {
  GeneralDOD, DomainAttrs, OutputDA, OutputDOD,
} from '../../../domain/domain-object/types';
import { GetDomainAttrsDotKeys } from '../../type-functions';
import { dtoUtility } from '../dto';

export class domainObjectUtility {
  static getOutputAttrs<
    ATTRS extends DomainAttrs,
    EXC extends GetDomainAttrsDotKeys<ATTRS>
  >(attrs: ATTRS, keys: EXC): OutputDA<ATTRS, EXC> {
    return dtoUtility.excludeDeepAttrs(attrs, keys);
  }

  static getOutputData<
    DATA extends GeneralDOD,
    EXC extends GetDomainAttrsDotKeys<DATA['attrs']>
  >(data: DATA, keys: EXC): OutputDOD<DATA, EXC> {
    return {
      ...data,
      attrs: dtoUtility.excludeDeepAttrs(data.attrs, keys),
    } as unknown as OutputDOD<DATA, EXC>;
  }
}
