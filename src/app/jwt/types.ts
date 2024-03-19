import { DTO } from '../../domain/dto';

export type JwtPayload<P extends DTO> = P & {
  exp: number, // jwt expires
  rExp: number, // refresh jwt expires
}
