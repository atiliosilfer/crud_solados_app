-- Add migration script here
CREATE TABLE Sole (
  id INTEGER PRIMARY KEY,
  deleted_at DATE,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE Stock (
  sole_id INTEGER NOT NULL REFERENCES Sole(id),
  size INTEGER DEFAULT 0,
  amount INTEGER DEFAULT 0
);

CREATE TABLE Orders (
  sole_id INTEGER NOT NULL REFERENCES Sole(id),
  size INTEGER DEFAULT 0,
  amount INTEGER DEFAULT 0,
  deleted_at DATE
);