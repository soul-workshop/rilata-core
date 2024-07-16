import { CallbackQuery } from '@grammyjs/types';

class CallbackQueryUtils {
  isCbQuery(cbQuery?: CallbackQuery): cbQuery is CallbackQuery {
    return cbQuery !== undefined;
  }

  isThisCbQuery(cbData: string, cbQuery?: CallbackQuery): boolean {
    return (cbQuery !== undefined) && (cbQuery.data === cbData);
  }
}

export const cbQueryUtils = new CallbackQueryUtils();
