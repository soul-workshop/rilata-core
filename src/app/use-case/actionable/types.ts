import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { ClassActionable } from './class-actionable';
import { InstanceActionable } from './instance-actionable';

export type ActionType = 'class' | 'instance';

export type GeneralInstanceActionable = InstanceActionable<GeneralARDParams, string>;

export type GeneralClassActionable = ClassActionable<GeneralARDParams, string>;
