# Ответственность модуля

Данный модуль ответственнен за сборку и запуск сервера.  
Для этого она собирает все репозитории, разрешает (резолвит) все зависимости и запускает сервер.

## Запуск сервера
`bun run tests/service-oriented-impl/zzz-run-server/main.ts`

Это позволит принимать http запросы на сервер через внешние инструменты (postman).

При запускe можно передать дополнительный параметр `-f` или `--fixtrures`. Это приведет к загрузке начального состояния приложения при загрузке сервера, т.е. добавлению объектов "Person", "User", "Company".

> Все данные добавляются в оперативной памяти и стираются в ходе выключения работы сервера.

## Выполнение запроса

После запуска тестового сервера, вы можете выполнять запросы. При этом каждый запрос вам необходимо подписать токеном авторизации добавляемого, в заголовок запроса (Headers).  
> Ниже приведен токен авторизации, действительный до 2050 года для данного тестового сервера.  

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjI1MjY4NTIzNTUzMDIsInJFeHAiOjI1MjY4NTIzNTUzMDJ9._UYd-o7eVRHfdBYv7L18NlFtmLh_QzZ2Foa6Nq8Y6oE`.

Для запуска вы можете использовать различные инструменты: postman, curl или через консоль браузера

### Запрос через консоль браузера
Ниже пример запроса через консоль:
```js
fetch('http://localhost:3000/api/subject-module/', {
  method: 'POST',
  body: JSON.stringify({
    meta: {
      name: "getPersonByIin",
      requestId: "dea2d31a-1179-4a68-a139-f3b6c8dd5aa0",
      domainType: "request",
    },
    attrs: {
      iin: "123123123123",
    },
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjI1MjY4NTIzNTUzMDIsInJFeHAiOjI1MjY4NTIzNTUzMDJ9._UYd-o7eVRHfdBYv7L18NlFtmLh_QzZ2Foa6Nq8Y6oE',
  }
})
.then(res => res.json())
.then((body) => console.log('success: ', body))
```
> если вы запустили сервер с флагом `-f`, то должны получить успешный ответ `success: true`

### Запрос через другие инструменты
Сервер принимает только post запросы. Каждый запрос должен отправляться на соответствующий url модуля. Url должен соответствовать следующему шаблону `https://<hostname>/api/<module-url>/`. Например: `https://localhost:3000/api/subject-module/`.  

В соответствии с используемым инструментом вам необходим прикрепить к запросу следующие данные.

<u>Тело запроса:</u>
```json
{
  "meta": {
    "name": "getPersonByIin",
    "requestId": "dea2d31a-1179-4a68-a139-f3b6c8dd5aa0",
    "domainType": "request",
  },
  "attrs": {
    "iin": "123123123123",
  },
};
```


<u>Заголовок запроса:</u>
```
headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjI1MjY4NTIzNTUzMDIsInJFeHAiOjI1MjY4NTIzNTUzMDJ9._UYd-o7eVRHfdBYv7L18NlFtmLh_QzZ2Foa6Nq8Y6oE',
}
```

## Зависимости
Данный модуль может импортировать все модули, ибо является конечным модулем для запуска сервера.
