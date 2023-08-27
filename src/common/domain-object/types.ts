import { IDType } from '../../common/types';
import { DTO } from '../dto';
import {
  ExcludeDeepAttrs,
  ExcludeDeepDotNotationAttrs, ExcludeDeepDtoAttrs, GetDtoKeysByDotNotation, UnionToTuple,
} from '../type-functions';

/** Domain Object Data */
export type ObjectAttrs = DTO;

export type IdObjectAttrs = {
  id: IDType,
}

export type ObjectType = 'value-object' | 'entity' | 'aggregate';

export type DomainType = 'domain-object' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error' | 'validation-error';

export type MutationType = 'read-model-object' | 'command-model-object';

export type ObjectMeta = {
  name?: string,
  objectType?: ObjectType,
  domainType?: DomainType,
  errorType?: ErrorType,
  mutationType?: MutationType,
}

export type Actions = Record<string, boolean>;

export type ObjectData<
  D extends ObjectAttrs,
  M extends ObjectMeta = ObjectMeta,
  A extends Actions = Actions,
> = {
  attrs: D,
  meta?: M,
  actions?: A,
}

export type GeneralObjectData = ObjectData<ObjectAttrs>;

export type ObjectFullData<D extends ObjectAttrs> = {
  classActions?: Actions,
  instances: D[],
}

export type GetObjectAttrs<D extends GeneralObjectData> = D extends ObjectData<infer A> ? A : never;

export type OutputObjectAttrs<
  ATTRS extends ObjectAttrs,
  EXC extends GetDtoKeysByDotNotation<ATTRS>[]
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;

export type OutputObjectData<
  DATA extends ObjectData<ObjectAttrs>,
  EXC extends GetDtoKeysByDotNotation<DATA['attrs']>[]
> = ExcludeDeepDtoAttrs<DATA['attrs'], EXC> extends infer ATTRS
  ? ATTRS extends DTO
    ? ObjectData<
        ATTRS,
        NonNullable<DATA['meta']>,
        NonNullable<DATA['actions']>
      >
    : never
  : never

// export type AA = {
//   a: {
//     b: {
//       c: string[],
//       e: Array<{f: {
//         a: number,
//         b?: number,
//       }, h: 5}>,
//       g: number
//     },
//     l: string,
//   }
//   h: ';'
// }
//
// type az = ExcludeDeepDtoAttrs<AA, 'a.b.g'>;
// const az: az = {
//   a: {
//     b: { e: [{ h: 5, f: { a: 7 } }], c: ['4'] },
//     l: 'l',
//   },
//   h: ';',
// };

// type zz = 'a.b.g' | 'h' | 'a.l';
// type xz = zz[];
// const xz = ['a'];
// type aa = ExcludeDeepDtoAttrs<AA, ['a.b.e', 'h', 'a.l']>;
// const ab: aa = {
//   a: {
//     b: {
//       c: ['d'],
//       g: 3,
//     },
//   },
// };
//
// type SS = ExcludeDeepDotNotationAttrs<AA, ['a.b.g', 'h', 'a.l']>
// const ss: SS = {
//   a: {
//     b: {
//       c: ['d'],
//       e: [{ f: { a: 5 }, h: 5 }],
//     },
//   },
// };
//
// type AF = ExcludeDeepAttrs<AA, ['a', 'v', 's']>
// const af: AF = {
//   h: ';',
// };
//
// type RF = ExcludeDeepAttrs<AA, ['a', 'l', 's']>
// const rf: RF = {
//   a: {
//     b: {
//       c: ['d'],
//       e: [{ f: { a: 5 }, h: 5 }],
//       g: 2,
//     },
//   },
//   h: ';',
// };
//
// type SF = ExcludeDeepAttrs<AA, ['h']>
// const sf: SF = {
//   a: {
//     b: {
//       c: ['d'],
//       e: [{ f: { a: 5 }, h: 5 }],
//       g: 2,
//     },
//     l: 's',
//   },
// };
//
// type FF = ExcludeDeepAttrs<AA, ['a', 'b', 'e', 'f']>
// const ff: FF = {
//   a: {
//     b: {
//       c: ['d'],
//       e: [{ h: 5 }],
//       g: 2,
//     },
//     l: 's',
//   },
//   h: ';',
// };
//
// type BBBBBB = ExcludeDeepAttrs<AA, ['a', 'b', 'e', 'f', 'a']>
// const bbbbbb: BBBBBB = {
//   a: {
//     b: {
//       c: ['d'],
//       e: [{ f: {}, h: 5 }],
//       g: 2,
//     },
//     l: 's',
//   },
//   h: ';',
// };
// type BB = ExcludeDeepAttrs<AA, ['a', 'b']>
//
// const bb: BB = {
//   a: {
//     l: 'l',
//   },
//   h: ';',
// };
//
// type BBB = ExcludeDeepAttrs<AA, ['a', 'b', 'c']>
// const bbb: BBB = {
//   a: {
//     b: {
//       e: [{ f: { a: 2 }, h: 5 }, { f: { a: 3 }, h: 5 }],
//       g: 2,
//     },
//     l: 's',
//   },
//   h: ';',
// };
//
// type BBBB = ExcludeDeepAttrs<AA, ['a', 'b', 'e']>
// const bbbb: BBBB = {
//   a: {
//     b: {
//       c: ['d'],
//       g: 2,
//     },
//     l: 's',
//   },
//   h: ';',
// };
