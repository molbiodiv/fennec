-- Table: oauth_provider

CREATE TABLE oauth_provider
(
      oauth_provider_id serial NOT NULL,
      provider text NOT NULL,
      CONSTRAINT oauth_provider_id_pkey PRIMARY KEY (oauth_provider_id),
      CONSTRAINT provider_uniq UNIQUE (provider)
)
WITH (
      OIDS=FALSE
);
-- Table: webuser

CREATE TABLE webuser
(
      webuser_id serial NOT NULL,
      oauth_provider_id INTEGER NOT NULL,
      oauth_id text NOT NULL,
      CONSTRAINT webuser_id_pkey PRIMARY KEY (webuser_id),
      CONSTRAINT oauth_provider_id_fkey FOREIGN KEY (oauth_provider_id)
          REFERENCES oauth_provider (oauth_provider_id) MATCH SIMPLE
          ON UPDATE NO ACTION ON DELETE NO ACTION,
      CONSTRAINT oauth_provider_id_oauth_id_uniq UNIQUE (oauth_provider_id, oauth_id)
)
WITH (
      OIDS=FALSE
);
-- Table: webuser_data

CREATE TABLE webuser_data
(
      webuser_data_id serial NOT NULL,
      webuser_id INTEGER NOT NULL,
      project jsonb NOT NULL,
      import_filename text,
      import_date timestamp with time zone DEFAULT now(),
      CONSTRAINT webuser_data_id_pkey PRIMARY KEY (webuser_data_id),
      CONSTRAINT webuser_id_fkey FOREIGN KEY (webuser_id)
          REFERENCES webuser (webuser_id) MATCH SIMPLE
          ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
      OIDS=FALSE
);
-- View: full_webuser_data

CREATE VIEW full_webuser_data AS
    SELECT webuser_data.webuser_data_id, webuser_data.project, webuser.oauth_id, oauth_provider.provider, webuser_data.import_date, webuser_data.import_filename
    FROM webuser, oauth_provider, webuser_data
    WHERE webuser.oauth_provider_id = oauth_provider.oauth_provider_id
    AND webuser_data.webuser_id = webuser.webuser_id;

-- Function: full_webuser_data_manage_row

CREATE OR REPLACE FUNCTION full_webuser_data_manage_row() RETURNS TRIGGER AS $$
   BEGIN
      IF (TG_OP = 'INSERT') THEN
        IF NEW.import_date IS NULL THEN
            NEW.import_date := now();
        END IF;
        INSERT INTO oauth_provider (provider) SELECT NEW.provider
        WHERE NOT EXISTS (
        SELECT oauth_provider_id FROM oauth_provider WHERE provider = NEW.provider
        );
        INSERT INTO webuser (oauth_provider_id, oauth_id) SELECT (SELECT oauth_provider_id FROM oauth_provider WHERE provider = NEW.provider), NEW.oauth_id
        WHERE NOT EXISTS (
        SELECT webuser_id FROM webuser WHERE oauth_provider_id = (SELECT oauth_provider_id FROM oauth_provider WHERE provider = NEW.provider) AND oauth_id = NEW.oauth_id
        );
        INSERT INTO webuser_data (webuser_id, project, import_date, import_filename) VALUES ((SELECT webuser_id FROM webuser WHERE oauth_provider_id = (SELECT oauth_provider_id FROM oauth_provider WHERE provider = NEW.provider) AND oauth_id = NEW.oauth_id), NEW.project, NEW.import_date, NEW.import_filename);
        RETURN NEW;
      ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM webuser_data WHERE webuser_data_id=OLD.webuser_data_id;
        IF NOT FOUND THEN
          RETURN NULL;
        END IF;
        RETURN OLD;
      END IF;
   END;
$$ LANGUAGE plpgsql;

-- Trigger: full_webuser_data_delete

CREATE TRIGGER full_webuser_data_delete INSTEAD OF DELETE ON full_webuser_data FOR EACH ROW EXECUTE PROCEDURE full_webuser_data_manage_row();

-- Trigger: full_webuser_data_insert

CREATE TRIGGER full_webuser_data_insert INSTEAD OF INSERT ON full_webuser_data FOR EACH ROW EXECUTE PROCEDURE full_webuser_data_manage_row();
