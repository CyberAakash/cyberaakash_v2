-- Migration v4.3: Add About section stats config keys

-- Add about section stats keys (DO NOTHING if already exist)
INSERT INTO site_config (key, value) VALUES ('stat_projects_value',     '"15+"') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stat_technologies_value', '"20+"') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stat_years_coding_value', '"3+"')  ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stat_coffee_value',       '"∞"')   ON CONFLICT (key) DO NOTHING;
