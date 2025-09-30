
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ngo_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  land_size REAL NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_ngo_id ON projects(ngo_id);
CREATE INDEX idx_projects_status ON projects(status);
