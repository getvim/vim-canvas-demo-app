CREATE TABLE settings (
    organization_id INTEGER PRIMARY KEY,
    theme_color TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);