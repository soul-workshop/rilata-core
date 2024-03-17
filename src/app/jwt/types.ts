import { DTO } from '../../domain/dto';

export type JwtPayload<P extends DTO> = P & {
  exp: number,
}
