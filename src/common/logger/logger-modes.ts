import { BinaryKeyFlag } from '../utils/index';

// ++++++++++++ types +++++++++++++++++

/* eslint-disable key-spacing */
export const loggerModes = {
  info:  0b000001, // 1
  warn:  0b000010, // 2
  error: 0b000100, // 4
  fatal: 0b001000, // 8
};

export type LoggerModes = keyof typeof loggerModes;

export type InputLoggerModes = LoggerModes[] | 'all' | 'off';

// ++++++++++++ const and functions +++++++++++++++++

let cachedLogMode: InputLoggerModes;

function calcLogMode(): InputLoggerModes {
  // в env можно передавать одну из значений 'info', 'warn', 'error', 'fatal', 'all', 'off'
  // или битовое число, например 5 означает сумму 1+4 = ['info', 'error']
  // число 0 эквивалентно 'off'.
  // любое другое значение эквивалентно 'all'
  const envLogMode = process.env.LOG_MODE ?? 'all';
  const flags = Number(envLogMode);
  if (isNaN(flags)) {
    if (envLogMode === 'all' || envLogMode === 'off') return envLogMode;
    if (Object.keys(loggerModes).includes(envLogMode)) {
      return [envLogMode] as LoggerModes[];
    }
  } else if (flags >= 0) {
    if (flags === 0) return 'off';
    const modes = BinaryKeyFlag.getFlagKeys(loggerModes, flags);
    if (modes.length !== 0) return modes;
  }
  return 'all';
}

export function getLoggerMode(): InputLoggerModes {
  if (cachedLogMode === undefined) {
    cachedLogMode = calcLogMode();
    // eslint-disable-next-line no-console
    console.log('log mode setted: ', cachedLogMode);
  }
  return cachedLogMode;
}
