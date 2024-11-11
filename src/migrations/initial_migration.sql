CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    date TEXT NOT NULL,
    invoice_id TEXT NOT NULL,
    item_id TEXT,
    cost INTEGER NOT NULL,
    tax_rate REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS tax_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    date TEXT NOT NULL,
    amount INTEGER NOT NULL
);
