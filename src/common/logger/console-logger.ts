/* eslint-disable no-console */
import { Logger } from './logger';

export class ConsoleLogger implements Logger {
  timeFormat: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
    hourCycle: 'h24',
  };

  async info(log: string): Promise<void> {
    this.toConsole(this.makeLogString('INFO', log));
  }

  async warning(log: string): Promise<void> {
    this.toConsole(this.makeLogString('WARNING', log));
  }

  async assert(condition: boolean, log: string, logAttrs?: unknown): Promise<void> {
    if (condition) return;
    this.fatalError(log, logAttrs);
  }

  error(log: string, logAttrs?: unknown): never {
    this.throwError(this.makeLogString('ERROR', log), logAttrs);
  }

  fatalError(log: string, logAttrs?: unknown): never {
    this.throwError(this.makeLogString('FATAL_ERROR', log), logAttrs);
  }

  private makeLogString(type: string, log: string): string {
    const dateTime = new Date().toLocaleString(undefined, this.timeFormat);
    return `${type}-${dateTime}: ${log}`;
  }

  private toConsole(text: string): void {
    console.log(text);
  }

  private throwError(err: string, logAttrs: unknown): never {
    this.toConsole(JSON.stringify(logAttrs));
    throw Error(err);
  }
}
