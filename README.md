# Документация 

У нас есть несколько рутов для взаимодействия с базой данных. Они разделены по группам. Всего предусмотерно три группы:
Группа        | Рут                      | Зачем нужно
------------- | ------------------------ | ------------- 
Приложение    | /api/app                 | Только для самого приложения
[Уровни скидок](#levels) | /api/discount | Для взаимодействия с [таблицей уровней](#table-of-levels)
[Карты](#cards)| /api/card                | Для взаимодействия с зарегистрированными  карточками

## Описание таблиц
```
discounts (
  id INTEGER первичный ключ ставится сам
  discount_level INTEGER, REQUIRED, UNIQUE 
  discount_percent INTEGER, REQUIRED,
)
```
Поле | Что значит | Параметры
---  | ---        | ---
id   | первичный ключ | ставится сам
discount_level | уровень накопления | целочисленный, обязательный, уникальный
discount_percent | процент накопления | целочисленный, обязательный 
```
cards (
  id INTEGER первичный ключ, ставится сам,
  card_number INTEGER REQUIRED,
  name STRING(255) REQUIRED,
  phone STRING(255),
  discount_level INTEGER DEFAULT=0,
  gave STRING(255) REQUIRED, 
  reason STRING(255) REQUIRED,
  date INTEGER таймстемп создания, ставится сам,
  score REAL DEFAULT=0,

  Связь по внешнему ключу с таблицей discounts:
  FOREIGN KEY (discount_level) REFERENCES discounts (discount_level)
)
```
Поле | Что значит | Параметры
---  | ---        | ---
id   | первичный ключ | ставится сам
card_number | номер карты | целочисленный, обязательный
name | имя человека | строка максимальной длины 255 символов, обязательный 
phone| телефон | строка максимальной длины 255
discount_level   | уровень накопления | целочисленный, по стандарту уровень нулевой
gave | кто выдал (имя) | строка максимальной длины 255, обязательный
reason | почему выдал | строка масимальной длины 255, обязательный
date | дата создания | целочисленный, ставится сам, [timestemp](#timestamp)
score | сколько накоплено, сумма | **НЕ**целочисленное, ставится сам, по дефолту = 0 

## Таблица уровней (изменяема) <a name="table-of-levels"></a>

Я сделал разделение по уровням: 

ID     | Уровень (discount_level) | Процент (discount_percent )
------ | ------------------------ | ------------- 
1      | 0 (default)              | 3
2      | 1                        | 5
23     | 2                        | 10

---
<h2 style="color: red;">Важно:</h2> 

*body* параметры всегда переддаются в формате [JSON](#json)


## Группа карт <a name="cards"></a>

Метод запроса | Рут             | Параметры | Что делает
---           | ---             | ---       | --- 
`GET`         | /api/card       | query: <br/> phone? card_number? name? | Возвращает полную информацию о пользователе (зарегистрированной карте) по номеру телефона, имени человека или комеру карты. Если укзаать несколько параметров, будет использоватся тот, что левее: <br/><br/> /api/card?**phone**=9876543210&?card_number="123456"            
`GET`         | /api/card/all   | ---       | Вся информация о всех зарегистрированных картах 
`PUT`         | /api/card/:id   | query: <br/> id: ID <br/><br/> body: card_number? <br/>name? <br/>phone? <br/>discount_level? <br/>gave? <br/>reason? <br/>score? | Может обновить любую информацию о карте **из указанных в body**. Запрос делается так: <br/><br/> /api/card/1 <br/><br/> body: <br/> { discount_level: 2 } <br/><br/> Этот запрос установит для карты с ID=1 уровень=2
`POST`        | /api/card/register | body: <br/> card_number <br/>name <br/> gave <br/>reason <br/>phone?  <br/>discount_level? <br/>score? | Добавляет новую карту в базу даннх. Поля **card_number, name, gave, reason** являются обязательными. <br/><br/>Стандартные значения для необязательных полей:<br/> dicount_level = 0 <br/> phone = '' <br/> score = 0,00
`DELETE`      | /api/card/:id | query:<br/>id: ID | Удаляет карту из базы данных по идентификатору

## Группа уровней скидок <a name="levels"></a>
Метод запроса | Рут             | Параметры | Что делает
---           | ---             | ---       | ---       
`GET`         | /api/discount   | ---       | Возвращает все доступные уровни скидок и их проценты.
`POST`        | /api/discount   | body: <br/> discount_level <br/> discount_percent | Добавляет новый уровень скидки
`PUT` | /api/discount/:level    | query: <br/> level<br/><br/>body: <br/> discount_percent | Для уровня *level* устанавливает новый процент. Процент указывается целым числом от 1 до 100.
`DLEETE` | /api/discount/:level | query: <br/> level | Удаляет указанный уровень *level*

---

### Что такое JSON <a name="json"></a>

Формат передачи данных формата ключ: значение. Это всегда строка. Пример:
```
{ 
  "name": "Denis Putnov",
  "discount_level": 3,
  "card_number": 12321312
}
```

### Что такое timestamp <a name="timestamp"></a>

Timestamp - временная метка, представленная целым числом, формат представления времени.
Легко переводится в дату, в паскале должны быть готовые алгоритмы. <br/>
Пощупать: https://www.epochconverter.com/