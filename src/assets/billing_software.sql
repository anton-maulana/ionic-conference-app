CREATE TABLE IF NOT EXISTS category
(
  id   INTEGER
    primary key
  autoincrement,
  name TEXT,
  desc TEXT
);

CREATE TABLE IF NOT EXISTS products
(
  id             INTEGER
    primary key
  autoincrement,
  name           TEXT,
  price          INTEGER,
  stock          INTEGER,
  desc           TEXT,
  code          INTEGER,
  product_image          BLOB,
  fk_category_id INTEGER
    constraint products_category_fk_category_id
    references category,
  date_created   TEXT,
  date_modified  TEXT
);


CREATE TABLE IF NOT EXISTS product_images
(
  id            INTEGER
    primary key
  autoincrement,
  name          TEXT,
  filename      TEXT,
  fk_product_id INTEGER
    constraint product_images_fk
    references products,
  date_created  TEXT,
  date_modified TEXT
);

CREATE TABLE IF NOT EXISTS transaction_log
(
  id            INTEGER
    primary key,
  buyer_name    INTEGER,
  total         INTEGER,
  date_created  TEXT,
  date_modified TEXT
);

CREATE TABLE IF NOT EXISTS transaction_detail
(
  id                    INTEGER
    primary key,
  fk_product_id         INTEGER
    constraint transaction_detail_fk_product_id
    references products,
  fk_transaction_log_id INTEGER
    constraint transaction_detail_fk_transaction_log
    references transaction_log,
  quantity              INTEGER,
  total_price           INTEGER
);




