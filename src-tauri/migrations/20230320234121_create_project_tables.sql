-- Add migration script here
CREATE TABLE Sole (
    id INTEGER PRIMARY KEY NOT NULL,
    active BOOLEAN DEFAULT true,
    name TEXT NOT NULL,
    stock_id INTEGER REFERENCES Stock(id),
    order_id INTEGER REFERENCES Orders(id)
);

CREATE TABLE Stock (
    id INTEGER PRIMARY KEY NOT NULL,
    size INTEGER DEFAULT 0,
    amount INTEGER DEFAULT 0
);

CREATE TABLE Orders (
    id INTEGER PRIMARY KEY NOT NULL,
    size INTEGER DEFAULT 0,
    amount INTEGER DEFAULT 0
);