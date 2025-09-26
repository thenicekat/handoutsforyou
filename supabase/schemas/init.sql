-- === placement_ctcs ===
CREATE TABLE placement_ctcs (
  company                  TEXT    PRIMARY KEY,
  basic_ctc                BIGINT,
  joining_bonus            BIGINT,
  relocation_bonus         BIGINT,
  variable_bonus           BIGINT,
  monetary_value_of_bond   BIGINT,
  description              TEXT,
  created_by               TEXT,
  campus                   TEXT,
  academic_year            TEXT
);

-- === ps1_responses ===
CREATE TABLE ps1_responses (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL,
  email        VARCHAR(255),
  allotment_round VARCHAR(255),
  year_and_sem VARCHAR(255),
  station      VARCHAR(255),
  cgpa         NUMERIC,
  preference   INT,
  id_number    VARCHAR(255),
  public       BOOLEAN,
  name         TEXT
);

-- === course_resources ===
CREATE TABLE course_resources (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  link        TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ NOT NULL,
  email       TEXT,
  score       INT,
  category    VARCHAR(255)
);

-- === ps2_responses ===
CREATE TABLE ps2_responses (
  id             SERIAL PRIMARY KEY,
  created_at     TIMESTAMPTZ NOT NULL,
  email          VARCHAR(255),
  id_number      VARCHAR(255),
  allotment_round VARCHAR(255),
  year_and_sem   VARCHAR(255),
  station        VARCHAR(255),
  cgpa           NUMERIC,
  preference     INT,
  offshoot       INT,
  offshoot_total INT,
  offshoot_type  VARCHAR(255),
  stipend        TEXT,
  public         BOOLEAN,
  name           TEXT
);

-- === si_companies ===
CREATE TABLE si_companies (
  name             VARCHAR(255),
  year             TEXT,
  eligibility      TEXT,
  cgpa_cutoff      TEXT,
  roles            TEXT,
  stipend          TEXT,
  otherdetails     TEXT
);

-- === higherstudies_resources ===
CREATE TABLE higherstudies_resources (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  link        TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ NOT NULL,
  email       TEXT,
  score       INT,
  category    VARCHAR(255)
);

-- === course_grading ===
CREATE TABLE course_grading (
  id           UUID PRIMARY KEY,
  course       TEXT,
  prof         TEXT,
  sem          TEXT,
  data         TEXT,
  created_by   TEXT,
  average_mark REAL,
  dept         TEXT
);

-- === ps1_reviews ===
CREATE TABLE ps1_reviews (
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(255),
  batch      VARCHAR(255),
  station    VARCHAR(255),
  review     TEXT
);

-- === ps2_reviews ===
CREATE TABLE ps2_reviews (
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(255),
  batch      VARCHAR(255),
  station    VARCHAR(255),
  review     TEXT
);

-- === course_reviews ===
CREATE TABLE course_reviews (
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(255),
  course     VARCHAR(255),
  prof       VARCHAR(255),
  review     TEXT
);

-- === donations ===
CREATE TABLE donations (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL,
  created_by  TEXT,
  amount      BIGINT,
  verified    SMALLINT,
  name        TEXT
);
