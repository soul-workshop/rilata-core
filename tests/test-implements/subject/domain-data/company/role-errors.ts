import { PermissionDeniedError } from '../../../../../src/app/service/error-types';

export type AllowedOnlyStaffManagersError = PermissionDeniedError<{
  text: 'Действие доступно только для менеджеров компании',
  hint: Record<never, unknown>,
}>

export type AllowedOnlyEmployeerError = PermissionDeniedError<{
  text: 'Действие доступно только для работников компании',
  hint: Record<never, unknown>,
}>
