import { Logger } from '../../common/logger/logger';
import { DTO } from '../../domain/dto';
import { Bus } from '../bus/bus';
import { JwtCreator } from '../jwt/jwt-creator';
import { JwtDecoder } from '../jwt/jwt-decoder';
import { JwtVerifier } from '../jwt/jwt-verifier';
import { RunMode } from '../types';
import { ServerConfig } from './types';

export type ServerResolves<JWT_P extends DTO> = {
  logger: Logger,
  runMode: RunMode,
  jwtDecoder: JwtDecoder<JWT_P>,
  jwtVerifier: JwtVerifier<JWT_P>,
  jwtCreator: JwtCreator<JWT_P>,
  serverConfig: ServerConfig,
}

export type BusServerResolves<JWT_P extends DTO> = ServerResolves<JWT_P> & {
  bus: Bus
}
