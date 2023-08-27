import {
  GeneralObjectData, ObjectAttrs, OutputObjectAttrs, OutputObjectData,
} from '../../domain-object/types';
import { dtoUtility } from '../dto';

export class domainObjectUtility {
  static getOutputAttrs<
    A extends ObjectAttrs,
    EXC extends string[]
  >(attrs: A, keys: EXC): OutputObjectAttrs<A, EXC> {
    return dtoUtility.excludeDeepAttrs(attrs, keys);
  }

  static getOutputData<
    D extends GeneralObjectData,
    EXC extends string[]
  >(data: D, keys: EXC): OutputObjectData<D, EXC> {
    return {
      ...data,
      attrs: dtoUtility.excludeDeepAttrs(data.attrs, keys),
    } as unknown as OutputObjectData<D, EXC>;
  }
}
