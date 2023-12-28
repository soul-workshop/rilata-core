/* eslint-disable no-console */
import { AssertionException } from '../exeptions';
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

  async warning(log: string, logAttrs?: unknown): Promise<void> {
    this.toConsole(this.makeLogString('WARNING', log), logAttrs);
  }

  async assert(condition: boolean, log: string, logAttrs?: unknown): Promise<void> {
    if (condition) return;
    throw this.fatalError(log, logAttrs);
  }

  async error(log: string, logAttrs?: unknown): Promise<AssertionException> {
    this.toConsole(
      this.makeLogString('ERROR', log),
      { ...this.getErrStack(), logAttrs },
    );
    return new AssertionException(log);
  }

  async fatalError(log: string, logAttrs?: unknown): Promise<AssertionException> {
    this.toConsole(
      this.makeLogString('FATAL_ERROR', log),
      { ...this.getErrStack(), logAttrs },
    );
    return new AssertionException(log);
  }

  private makeLogString(type: string, log: string): string {
    const dateTime = new Date().toLocaleString(undefined, this.timeFormat);
    return `${type}-${dateTime}: ${log}`;
  }

  private getErrStack(): { stack: string[] } {
    try {
      throw Error();
    } catch (e) {
      return { stack: (e as Error).stack?.split('\n') ?? ['no stack'] };
    }
  }

  private toConsole(text: string, logAttrs?: unknown): void {
    console.log('----- console log start -------');
    console.log(text);
    console.log(JSON.stringify(logAttrs, null, 2));
    console.log('----- console log end -------');
  }
}
