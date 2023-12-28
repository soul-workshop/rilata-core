import { Databaseable } from './databaseable';
import { Repositoriable } from './repositoriable';
import { Loggable } from './loggable';
import { Moduleable } from './moduleable';
import { Module } from '../module/module';
import { TokenVerifier } from '../jwt/token-verifier.interface';
import { DTO } from '../../domain/dto';
import { RunMode } from '../types';

export interface ModuleResolver
  extends Moduleable, Loggable, Repositoriable, Databaseable {
  init(module: Module): void

  getTokenVerifier(): TokenVerifier<DTO>

  getRunMode(): RunMode
}
