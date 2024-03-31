export const loggerModes = {
  info: 0b1,
  warn: 0b10,
  error: 0b100,
  fatal: 0b1000,
};

export function getLoggerMode(): Array<keyof typeof loggerModes> | 'all' | 'off' {
  function isLogMode(value: string): value is keyof typeof loggerModes | 'all' | 'off' {
    return Object.keys(loggerModes).concat('all', 'off').includes(value);
  }
  const envLogMode = process.env.LOG_MODE;
  const logMode = (
    envLogMode && isLogMode(envLogMode) ? envLogMode : 'all'
  );
  return logMode === 'all' || logMode === 'off' ? logMode : [logMode];
}
