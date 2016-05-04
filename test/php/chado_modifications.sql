-- Table: oauth_provider

DROP TABLE IF EXISTS oauth_provider;

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

DROP TABLE IF EXISTS webuser;

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

DROP TABLE IF EXISTS webuser_data;

CREATE TABLE webuser_data
(
      webuser_data_id serial NOT NULL,
      webuser_id INTEGER NOT NULL,
      project jsonb NOT NULL,
      import_date timestamp with time zone DEFAULT now(),
      CONSTRAINT webuser_data_id_pkey PRIMARY KEY (webuser_data_id),
      CONSTRAINT webuser_id_fkey FOREIGN KEY (webuser_id)
          REFERENCES webuser (webuser_id) MATCH SIMPLE
          ON UPDATE NO ACTION ON DELETE NO ACTION,
      CONSTRAINT webuser_id_project_uniq UNIQUE (webuser_id, project)
)
WITH (
      OIDS=FALSE
);
