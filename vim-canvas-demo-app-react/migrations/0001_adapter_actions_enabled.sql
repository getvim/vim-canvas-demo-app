ALTER TABLE settings
ADD COLUMN adapter_actions_enabled INTEGER NOT NULL DEFAULT 0
CHECK (adapter_actions_enabled IN (0, 1));
