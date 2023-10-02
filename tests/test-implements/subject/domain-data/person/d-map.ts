import { AggregateDomainMap, DomainMap } from '../../../../../src/domain/domain-object-data/common-types';
import {
  ContactsAttrs, EmailAttrs, PersonAttrs, PhoneAttrs,
} from './params';

export const phoneDMap: DomainMap<PhoneAttrs> = {
  number: {
    label: 'Номер телефона',
    placeHolder: 'Введите номер телефона',
    attributeDescription: 'Номер телефона позволит другим участникам команды связаться с вами',
  },
  type: {
    label: 'Тип телефона',
    choice: ['Личный', 'Рабочий'],
    attributeDescription: 'Дает больше информации и помогает принять лучшее решение о целесообразности звонка',
  },
};

export const emailDMap: DomainMap<EmailAttrs> = {
  email: {
    label: 'Эл. почта',
    placeHolder: 'Введите электронную почту',
    attributeDescription: 'Позволяет другим участниками команды доставить вам необходимую информацию',
  },
  type: {
    label: 'Тип почты',
    choice: ['Личный', 'Рабочий'],
    attributeDescription: 'Может быть важной информацией для отправителя',
  },
};

export const contactsDMap: DomainMap<ContactsAttrs> = {
  email: {
    name: 'Электронная почта',
    pluralName: 'Электронные почты',
    domainMap: emailDMap,
  },
  phones: {
    name: 'Телефон',
    pluralName: 'Телефоны',
    domainMap: phoneDMap,
  },
  address: {
    label: 'Почтовый адрес',
    attributeDescription: 'Позволяет доставить вам информацию в твердых носителях',
    placeHolder: 'Введите почтовый адрес',
  },
};

export const personDMap: DomainMap<PersonAttrs> = {
  id: {
    label: 'Идентификатор ФЛ',
    attributeDescription: 'Позволяет приложению гарантированно идентифицировать ФЛ',
  },
  govPersonId: {
    label: 'Государственный идентификатор ФЛ',
    attributeDescription: 'Позволяет синхронизировать данные ФЛ с других систем',
  },
  name: {
    label: 'Имя физического лица',
    attributeDescription: 'Позволяет другим ФЛ обращаться по имени',
    placeHolder: 'Введите имя физического лица',
  },
  lastName: {
    label: 'Фамилия физического лица',
    attributeDescription: 'Позволяет другим ФЛ обращаться по фамилии',
    placeHolder: 'Введите фамилию физического лица',
  },
  patronomic: {
    label: 'Отчество физического лица',
    attributeDescription: 'Позволяет другим ФЛ обращаться по отчеству',
    placeHolder: 'Введите отчество физического лица',
  },
  contacts: {
    name: 'Контакт ФЛ',
    pluralName: 'Контакты ФЛ',
    domainMap: contactsDMap,
  },
};

export const personAggregateDMap: AggregateDomainMap<PersonAttrs> = {
  name: 'Физическое лицо',
  pluralName: 'Физические лица',
  domainMap: personDMap,
};
