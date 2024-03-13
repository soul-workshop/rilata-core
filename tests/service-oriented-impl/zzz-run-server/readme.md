# Ответственность модуля

Данный модуль ответственнен за сборку и запуск сервера.  
Для этого она собирает все репозитории, разрешает (резолвит) все зависимости и запускает сервер.

## Запуск сервера
`bun run tests/service-oriented-impl/zzz-run-server/main.ts`

Это позволит принимать http запросы на сервер через внешние инструменты (postman).

Чтобы загрузка успешно обработалась необходимо добавить муляж токена авторизации.

Ниже пример запроса:
```js
const requestDod = {
  meta: {
    name: "getPersonByIin",
    requestId: "dea2d31a-1179-4a68-a139-f3b6c8dd5aa0",
    domainType: "request",
  },
  attrs: {
    iin: "123123123123",
  },
};

const req = new Request(new URL('some-url-paht'), {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    authorization: '{"access":"{\"userId\":\"2a96aec7-1091-4449-8369-c3d9f91f1a56\"}","refresh":"someTokenValue"}',
  },
  body: JSON.stringify(requestDod),
})
```

Можно передать дополнительный параметр `-f` или `--fixtrures`. Это приведет к загрузке начального состояния приложения при загрузке сервера, т.е. добавлению объектов "Person", "User", "Company".

Все данные добавляются в оперативной памяти и стираются в ходе выключения работы сервера.

## Зависимости
Данный модуль может импортировать все модули, ибо является конечным модулем для запуска сервера.
