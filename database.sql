
CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  discount_level INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL,
  UNIQUE (discount_level)
);

create TABLE cards (
  id SERIAL PRIMARY KEY,
  card_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  discount_level INTEGER DEFAULT 0 NOT NULL,
  gave VARCHAR(255) NOT NULL, 
  reason VARCHAR(255),
  date INTEGER NOT NULL,
  score REAL DEFAULT 0 NOT NULL,
  FOREIGN KEY (discount_level) REFERENCES discounts (discount_level)
);