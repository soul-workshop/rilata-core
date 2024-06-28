import { MessageEntity } from '@grammyjs/types';

class EntityUtils {
  getEntities(type: MessageEntity['type'], entities?: MessageEntity[]): MessageEntity[] {
    return (entities ?? []).filter((e) => e.type === type);
  }

  getEntityValues(entities: MessageEntity[], text?: string): string[] {
    return entities
      .map((e) => (text ?? '').substring(e.offset, e.offset + e.length))
      .filter((str) => str !== '');
  }
}

export const entityUtils = new EntityUtils();
