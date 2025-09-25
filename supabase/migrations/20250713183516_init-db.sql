create sequence "public"."course_resources_id_seq";

create sequence "public"."donations_id_seq";

create sequence "public"."higherstudies_resources_id_seq";

create sequence "public"."ps1_responses_id_seq";

create sequence "public"."ps2_responses_id_seq";

create sequence "public"."placement_resources_id_seq";

create table "public"."course_grading" (
    "id" uuid not null,
    "course" text,
    "prof" text,
    "sem" text,
    "data" text,
    "created_by" text,
    "average_mark" real,
    "dept" text
);


create table "public"."course_resources" (
    "id" integer not null default nextval('course_resources_id_seq'::regclass),
    "name" text,
    "link" text,
    "created_by" text,
    "created_at" timestamp with time zone not null,
    "email" text,
    "score" integer,
    "category" character varying(255)
);


create table "public"."course_reviews" (
    "created_at" timestamp with time zone not null,
    "created_by" character varying(255),
    "course" character varying(255),
    "prof" character varying(255),
    "review" text
);


create table "public"."donations" (
    "id" bigint not null default nextval('donations_id_seq'::regclass),
    "created_at" timestamp with time zone not null,
    "created_by" text,
    "amount" bigint,
    "verified" smallint,
    "name" text
);


create table "public"."higherstudies_resources" (
    "id" integer not null default nextval('higherstudies_resources_id_seq'::regclass),
    "name" text,
    "link" text,
    "created_by" text,
    "created_at" timestamp with time zone not null,
    "email" text,
    "score" integer,
    "category" character varying(255)
);


create table "public"."placement_ctcs" (
    "company" text not null,
    "base" bigint,
    "joining_bonus" bigint,
    "relocation_bonus" bigint,
    "variable_bonus" bigint,
    "monetary_value_of_benefits" bigint,
    "description" text,
    "created_by" text,
    "campus" text,
    "academic_year" text
);


create table "public"."placement_resources" (
    "id" bigint not null default nextval('placement_resources_id_seq'::regclass),
    "name" text,
    "link" text,
    "created_by" text,
    "created_at" timestamp with time zone not null,
    "email" text,
    "score" integer,
    "category" character varying(255)
);


create table "public"."ps1_responses" (
    "id" integer not null default nextval('ps1_responses_id_seq'::regclass),
    "created_at" timestamp with time zone not null,
    "email" character varying(255),
    "allotment_round" character varying(255),
    "year_and_sem" character varying(255),
    "station" character varying(255),
    "cgpa" numeric,
    "preference" integer,
    "id_number" character varying(255),
    "public" boolean,
    "name" text
);


create table "public"."ps1_reviews" (
    "created_at" timestamp with time zone not null,
    "created_by" character varying(255),
    "batch" character varying(255),
    "station" character varying(255),
    "review" text
);


create table "public"."ps2_responses" (
    "id" integer not null default nextval('ps2_responses_id_seq'::regclass),
    "created_at" timestamp with time zone not null,
    "email" character varying(255),
    "id_number" character varying(255),
    "allotment_round" character varying(255),
    "year_and_sem" character varying(255),
    "station" character varying(255),
    "cgpa" numeric,
    "preference" integer,
    "offshoot" integer,
    "offshoot_total" integer,
    "offshoot_type" character varying(255),
    "stipend" text,
    "public" boolean,
    "name" text
);


create table "public"."ps2_reviews" (
    "created_at" timestamp with time zone not null,
    "created_by" character varying(255),
    "batch" character varying(255),
    "station" character varying(255),
    "review" text
);


create table "public"."si_chronicles" (
    "name" character varying(255),
    "company" text,
    "year" text,
    "cgpa" character varying(255),
    "role" character varying(255),
    "text" text
);


create table "public"."si_companies" (
    "name" character varying(255),
    "year" text,
    "eligibility" text,
    "cgpa_cutoff" text,
    "roles" text,
    "selects" text,
    "selection_rounds" text,
    "stipend" text,
    "otherdetails" text
);


alter sequence "public"."course_resources_id_seq" owned by "public"."course_resources"."id";

alter sequence "public"."donations_id_seq" owned by "public"."donations"."id";

alter sequence "public"."higherstudies_resources_id_seq" owned by "public"."higherstudies_resources"."id";

alter sequence "public"."ps1_responses_id_seq" owned by "public"."ps1_responses"."id";

alter sequence "public"."ps2_responses_id_seq" owned by "public"."ps2_responses"."id";

alter sequence "public"."placement_resources_id_seq" owned by "public"."placement_resources"."id";

CREATE UNIQUE INDEX course_grading_pkey ON public.course_grading USING btree (id);

CREATE UNIQUE INDEX course_resources_pkey ON public.course_resources USING btree (id);

CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (id);

CREATE UNIQUE INDEX higherstudies_resources_pkey ON public.higherstudies_resources USING btree (id);

CREATE UNIQUE INDEX placement_ctcs_pkey ON public.placement_ctcs USING btree (company);

CREATE UNIQUE INDEX placement_resources_pkey ON public.placement_resources USING btree (id);

CREATE UNIQUE INDEX ps1_responses_pkey ON public.ps1_responses USING btree (id);

CREATE UNIQUE INDEX ps2_responses_pkey ON public.ps2_responses USING btree (id);

alter table "public"."course_grading" add constraint "course_grading_pkey" PRIMARY KEY using index "course_grading_pkey";

alter table "public"."course_resources" add constraint "course_resources_pkey" PRIMARY KEY using index "course_resources_pkey";

alter table "public"."donations" add constraint "donations_pkey" PRIMARY KEY using index "donations_pkey";

alter table "public"."higherstudies_resources" add constraint "higherstudies_resources_pkey" PRIMARY KEY using index "higherstudies_resources_pkey";

alter table "public"."placement_ctcs" add constraint "placement_ctcs_pkey" PRIMARY KEY using index "placement_ctcs_pkey";

alter table "public"."placement_resources" add constraint "placement_resources_pkey" PRIMARY KEY using index "placement_resources_pkey";

alter table "public"."ps1_responses" add constraint "ps1_responses_pkey" PRIMARY KEY using index "ps1_responses_pkey";

alter table "public"."ps2_responses" add constraint "ps2_responses_pkey" PRIMARY KEY using index "ps2_responses_pkey";

grant delete on table "public"."course_grading" to "anon";

grant insert on table "public"."course_grading" to "anon";

grant references on table "public"."course_grading" to "anon";

grant select on table "public"."course_grading" to "anon";

grant trigger on table "public"."course_grading" to "anon";

grant truncate on table "public"."course_grading" to "anon";

grant update on table "public"."course_grading" to "anon";

grant delete on table "public"."course_grading" to "authenticated";

grant insert on table "public"."course_grading" to "authenticated";

grant references on table "public"."course_grading" to "authenticated";

grant select on table "public"."course_grading" to "authenticated";

grant trigger on table "public"."course_grading" to "authenticated";

grant truncate on table "public"."course_grading" to "authenticated";

grant update on table "public"."course_grading" to "authenticated";

grant delete on table "public"."course_grading" to "service_role";

grant insert on table "public"."course_grading" to "service_role";

grant references on table "public"."course_grading" to "service_role";

grant select on table "public"."course_grading" to "service_role";

grant trigger on table "public"."course_grading" to "service_role";

grant truncate on table "public"."course_grading" to "service_role";

grant update on table "public"."course_grading" to "service_role";

grant delete on table "public"."course_resources" to "anon";

grant insert on table "public"."course_resources" to "anon";

grant references on table "public"."course_resources" to "anon";

grant select on table "public"."course_resources" to "anon";

grant trigger on table "public"."course_resources" to "anon";

grant truncate on table "public"."course_resources" to "anon";

grant update on table "public"."course_resources" to "anon";

grant delete on table "public"."course_resources" to "authenticated";

grant insert on table "public"."course_resources" to "authenticated";

grant references on table "public"."course_resources" to "authenticated";

grant select on table "public"."course_resources" to "authenticated";

grant trigger on table "public"."course_resources" to "authenticated";

grant truncate on table "public"."course_resources" to "authenticated";

grant update on table "public"."course_resources" to "authenticated";

grant delete on table "public"."course_resources" to "service_role";

grant insert on table "public"."course_resources" to "service_role";

grant references on table "public"."course_resources" to "service_role";

grant select on table "public"."course_resources" to "service_role";

grant trigger on table "public"."course_resources" to "service_role";

grant truncate on table "public"."course_resources" to "service_role";

grant update on table "public"."course_resources" to "service_role";

grant delete on table "public"."course_reviews" to "anon";

grant insert on table "public"."course_reviews" to "anon";

grant references on table "public"."course_reviews" to "anon";

grant select on table "public"."course_reviews" to "anon";

grant trigger on table "public"."course_reviews" to "anon";

grant truncate on table "public"."course_reviews" to "anon";

grant update on table "public"."course_reviews" to "anon";

grant delete on table "public"."course_reviews" to "authenticated";

grant insert on table "public"."course_reviews" to "authenticated";

grant references on table "public"."course_reviews" to "authenticated";

grant select on table "public"."course_reviews" to "authenticated";

grant trigger on table "public"."course_reviews" to "authenticated";

grant truncate on table "public"."course_reviews" to "authenticated";

grant update on table "public"."course_reviews" to "authenticated";

grant delete on table "public"."course_reviews" to "service_role";

grant insert on table "public"."course_reviews" to "service_role";

grant references on table "public"."course_reviews" to "service_role";

grant select on table "public"."course_reviews" to "service_role";

grant trigger on table "public"."course_reviews" to "service_role";

grant truncate on table "public"."course_reviews" to "service_role";

grant update on table "public"."course_reviews" to "service_role";

grant delete on table "public"."donations" to "anon";

grant insert on table "public"."donations" to "anon";

grant references on table "public"."donations" to "anon";

grant select on table "public"."donations" to "anon";

grant trigger on table "public"."donations" to "anon";

grant truncate on table "public"."donations" to "anon";

grant update on table "public"."donations" to "anon";

grant delete on table "public"."donations" to "authenticated";

grant insert on table "public"."donations" to "authenticated";

grant references on table "public"."donations" to "authenticated";

grant select on table "public"."donations" to "authenticated";

grant trigger on table "public"."donations" to "authenticated";

grant truncate on table "public"."donations" to "authenticated";

grant update on table "public"."donations" to "authenticated";

grant delete on table "public"."donations" to "service_role";

grant insert on table "public"."donations" to "service_role";

grant references on table "public"."donations" to "service_role";

grant select on table "public"."donations" to "service_role";

grant trigger on table "public"."donations" to "service_role";

grant truncate on table "public"."donations" to "service_role";

grant update on table "public"."donations" to "service_role";

grant delete on table "public"."higherstudies_resources" to "anon";

grant insert on table "public"."higherstudies_resources" to "anon";

grant references on table "public"."higherstudies_resources" to "anon";

grant select on table "public"."higherstudies_resources" to "anon";

grant trigger on table "public"."higherstudies_resources" to "anon";

grant truncate on table "public"."higherstudies_resources" to "anon";

grant update on table "public"."higherstudies_resources" to "anon";

grant delete on table "public"."higherstudies_resources" to "authenticated";

grant insert on table "public"."higherstudies_resources" to "authenticated";

grant references on table "public"."higherstudies_resources" to "authenticated";

grant select on table "public"."higherstudies_resources" to "authenticated";

grant trigger on table "public"."higherstudies_resources" to "authenticated";

grant truncate on table "public"."higherstudies_resources" to "authenticated";

grant update on table "public"."higherstudies_resources" to "authenticated";

grant delete on table "public"."higherstudies_resources" to "service_role";

grant insert on table "public"."higherstudies_resources" to "service_role";

grant references on table "public"."higherstudies_resources" to "service_role";

grant select on table "public"."higherstudies_resources" to "service_role";

grant trigger on table "public"."higherstudies_resources" to "service_role";

grant truncate on table "public"."higherstudies_resources" to "service_role";

grant update on table "public"."higherstudies_resources" to "service_role";

grant delete on table "public"."placement_ctcs" to "anon";

grant insert on table "public"."placement_ctcs" to "anon";

grant references on table "public"."placement_ctcs" to "anon";

grant select on table "public"."placement_ctcs" to "anon";

grant trigger on table "public"."placement_ctcs" to "anon";

grant truncate on table "public"."placement_ctcs" to "anon";

grant update on table "public"."placement_ctcs" to "anon";

grant delete on table "public"."placement_ctcs" to "authenticated";

grant insert on table "public"."placement_ctcs" to "authenticated";

grant references on table "public"."placement_ctcs" to "authenticated";

grant select on table "public"."placement_ctcs" to "authenticated";

grant trigger on table "public"."placement_ctcs" to "authenticated";

grant truncate on table "public"."placement_ctcs" to "authenticated";

grant update on table "public"."placement_ctcs" to "authenticated";

grant delete on table "public"."placement_ctcs" to "service_role";

grant insert on table "public"."placement_ctcs" to "service_role";

grant references on table "public"."placement_ctcs" to "service_role";

grant select on table "public"."placement_ctcs" to "service_role";

grant trigger on table "public"."placement_ctcs" to "service_role";

grant truncate on table "public"."placement_ctcs" to "service_role";

grant update on table "public"."placement_ctcs" to "service_role";

grant delete on table "public"."placement_resources" to "anon";

grant insert on table "public"."placement_resources" to "anon";

grant references on table "public"."placement_resources" to "anon";

grant select on table "public"."placement_resources" to "anon";

grant trigger on table "public"."placement_resources" to "anon";

grant truncate on table "public"."placement_resources" to "anon";

grant update on table "public"."placement_resources" to "anon";

grant delete on table "public"."placement_resources" to "authenticated";

grant insert on table "public"."placement_resources" to "authenticated";

grant references on table "public"."placement_resources" to "authenticated";

grant select on table "public"."placement_resources" to "authenticated";

grant trigger on table "public"."placement_resources" to "authenticated";

grant truncate on table "public"."placement_resources" to "authenticated";

grant update on table "public"."placement_resources" to "authenticated";

grant delete on table "public"."placement_resources" to "service_role";

grant insert on table "public"."placement_resources" to "service_role";

grant references on table "public"."placement_resources" to "service_role";

grant select on table "public"."placement_resources" to "service_role";

grant trigger on table "public"."placement_resources" to "service_role";

grant truncate on table "public"."placement_resources" to "service_role";

grant update on table "public"."placement_resources" to "service_role";

grant delete on table "public"."ps1_responses" to "anon";

grant insert on table "public"."ps1_responses" to "anon";

grant references on table "public"."ps1_responses" to "anon";

grant select on table "public"."ps1_responses" to "anon";

grant trigger on table "public"."ps1_responses" to "anon";

grant truncate on table "public"."ps1_responses" to "anon";

grant update on table "public"."ps1_responses" to "anon";

grant delete on table "public"."ps1_responses" to "authenticated";

grant insert on table "public"."ps1_responses" to "authenticated";

grant references on table "public"."ps1_responses" to "authenticated";

grant select on table "public"."ps1_responses" to "authenticated";

grant trigger on table "public"."ps1_responses" to "authenticated";

grant truncate on table "public"."ps1_responses" to "authenticated";

grant update on table "public"."ps1_responses" to "authenticated";

grant delete on table "public"."ps1_responses" to "service_role";

grant insert on table "public"."ps1_responses" to "service_role";

grant references on table "public"."ps1_responses" to "service_role";

grant select on table "public"."ps1_responses" to "service_role";

grant trigger on table "public"."ps1_responses" to "service_role";

grant truncate on table "public"."ps1_responses" to "service_role";

grant update on table "public"."ps1_responses" to "service_role";

grant delete on table "public"."ps1_reviews" to "anon";

grant insert on table "public"."ps1_reviews" to "anon";

grant references on table "public"."ps1_reviews" to "anon";

grant select on table "public"."ps1_reviews" to "anon";

grant trigger on table "public"."ps1_reviews" to "anon";

grant truncate on table "public"."ps1_reviews" to "anon";

grant update on table "public"."ps1_reviews" to "anon";

grant delete on table "public"."ps1_reviews" to "authenticated";

grant insert on table "public"."ps1_reviews" to "authenticated";

grant references on table "public"."ps1_reviews" to "authenticated";

grant select on table "public"."ps1_reviews" to "authenticated";

grant trigger on table "public"."ps1_reviews" to "authenticated";

grant truncate on table "public"."ps1_reviews" to "authenticated";

grant update on table "public"."ps1_reviews" to "authenticated";

grant delete on table "public"."ps1_reviews" to "service_role";

grant insert on table "public"."ps1_reviews" to "service_role";

grant references on table "public"."ps1_reviews" to "service_role";

grant select on table "public"."ps1_reviews" to "service_role";

grant trigger on table "public"."ps1_reviews" to "service_role";

grant truncate on table "public"."ps1_reviews" to "service_role";

grant update on table "public"."ps1_reviews" to "service_role";

grant delete on table "public"."ps2_responses" to "anon";

grant insert on table "public"."ps2_responses" to "anon";

grant references on table "public"."ps2_responses" to "anon";

grant select on table "public"."ps2_responses" to "anon";

grant trigger on table "public"."ps2_responses" to "anon";

grant truncate on table "public"."ps2_responses" to "anon";

grant update on table "public"."ps2_responses" to "anon";

grant delete on table "public"."ps2_responses" to "authenticated";

grant insert on table "public"."ps2_responses" to "authenticated";

grant references on table "public"."ps2_responses" to "authenticated";

grant select on table "public"."ps2_responses" to "authenticated";

grant trigger on table "public"."ps2_responses" to "authenticated";

grant truncate on table "public"."ps2_responses" to "authenticated";

grant update on table "public"."ps2_responses" to "authenticated";

grant delete on table "public"."ps2_responses" to "service_role";

grant insert on table "public"."ps2_responses" to "service_role";

grant references on table "public"."ps2_responses" to "service_role";

grant select on table "public"."ps2_responses" to "service_role";

grant trigger on table "public"."ps2_responses" to "service_role";

grant truncate on table "public"."ps2_responses" to "service_role";

grant update on table "public"."ps2_responses" to "service_role";

grant delete on table "public"."ps2_reviews" to "anon";

grant insert on table "public"."ps2_reviews" to "anon";

grant references on table "public"."ps2_reviews" to "anon";

grant select on table "public"."ps2_reviews" to "anon";

grant trigger on table "public"."ps2_reviews" to "anon";

grant truncate on table "public"."ps2_reviews" to "anon";

grant update on table "public"."ps2_reviews" to "anon";

grant delete on table "public"."ps2_reviews" to "authenticated";

grant insert on table "public"."ps2_reviews" to "authenticated";

grant references on table "public"."ps2_reviews" to "authenticated";

grant select on table "public"."ps2_reviews" to "authenticated";

grant trigger on table "public"."ps2_reviews" to "authenticated";

grant truncate on table "public"."ps2_reviews" to "authenticated";

grant update on table "public"."ps2_reviews" to "authenticated";

grant delete on table "public"."ps2_reviews" to "service_role";

grant insert on table "public"."ps2_reviews" to "service_role";

grant references on table "public"."ps2_reviews" to "service_role";

grant select on table "public"."ps2_reviews" to "service_role";

grant trigger on table "public"."ps2_reviews" to "service_role";

grant truncate on table "public"."ps2_reviews" to "service_role";

grant update on table "public"."ps2_reviews" to "service_role";

grant delete on table "public"."si_chronicles" to "anon";

grant insert on table "public"."si_chronicles" to "anon";

grant references on table "public"."si_chronicles" to "anon";

grant select on table "public"."si_chronicles" to "anon";

grant trigger on table "public"."si_chronicles" to "anon";

grant truncate on table "public"."si_chronicles" to "anon";

grant update on table "public"."si_chronicles" to "anon";

grant delete on table "public"."si_chronicles" to "authenticated";

grant insert on table "public"."si_chronicles" to "authenticated";

grant references on table "public"."si_chronicles" to "authenticated";

grant select on table "public"."si_chronicles" to "authenticated";

grant trigger on table "public"."si_chronicles" to "authenticated";

grant truncate on table "public"."si_chronicles" to "authenticated";

grant update on table "public"."si_chronicles" to "authenticated";

grant delete on table "public"."si_chronicles" to "service_role";

grant insert on table "public"."si_chronicles" to "service_role";

grant references on table "public"."si_chronicles" to "service_role";

grant select on table "public"."si_chronicles" to "service_role";

grant trigger on table "public"."si_chronicles" to "service_role";

grant truncate on table "public"."si_chronicles" to "service_role";

grant update on table "public"."si_chronicles" to "service_role";

grant delete on table "public"."si_companies" to "anon";

grant insert on table "public"."si_companies" to "anon";

grant references on table "public"."si_companies" to "anon";

grant select on table "public"."si_companies" to "anon";

grant trigger on table "public"."si_companies" to "anon";

grant truncate on table "public"."si_companies" to "anon";

grant update on table "public"."si_companies" to "anon";

grant delete on table "public"."si_companies" to "authenticated";

grant insert on table "public"."si_companies" to "authenticated";

grant references on table "public"."si_companies" to "authenticated";

grant select on table "public"."si_companies" to "authenticated";

grant trigger on table "public"."si_companies" to "authenticated";

grant truncate on table "public"."si_companies" to "authenticated";

grant update on table "public"."si_companies" to "authenticated";

grant delete on table "public"."si_companies" to "service_role";

grant insert on table "public"."si_companies" to "service_role";

grant references on table "public"."si_companies" to "service_role";

grant select on table "public"."si_companies" to "service_role";

grant trigger on table "public"."si_companies" to "service_role";

grant truncate on table "public"."si_companies" to "service_role";

grant update on table "public"."si_companies" to "service_role";


