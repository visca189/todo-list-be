set timezone to 'UTC';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS duty (
  id text default replace(uuid_generate_v4()::text, '-', '') primary key,
  name text not null,
  is_completed boolean default false,
  custom_data jsonb default '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at_trigger
AFTER UPDATE ON duty
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();
