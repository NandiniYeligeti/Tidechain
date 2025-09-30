
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  buyer_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  credits_purchased REAL NOT NULL,
  total_amount REAL NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_certificate_id ON transactions(certificate_id);
