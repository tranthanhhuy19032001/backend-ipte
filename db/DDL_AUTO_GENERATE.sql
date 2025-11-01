-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION "admin";

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public."consult_status";

CREATE TYPE public."consult_status" AS ENUM (
	'PENDING',
	'CONTACTED',
	'SCHEDULED',
	'CLOSED',
	'CONVERTED');

-- DROP TYPE public."contact_method";

CREATE TYPE public."contact_method" AS ENUM (
	'PHONE',
	'EMAIL',
	'ZALO',
	'MESSENGER',
	'WHATSAPP',
	'OTHER');

-- DROP TYPE public."course_category";

CREATE TYPE public."course_category" AS ENUM (
	'BASIS',
	'ADVANCE',
	'IPASS');

-- DROP TYPE public."course_level";

CREATE TYPE public."course_level" AS ENUM (
	'BEGINNER',
	'INTERMEDIATE',
	'ADVANCED');

-- DROP TYPE public."course_mode";

CREATE TYPE public."course_mode" AS ENUM (
	'ONLINE',
	'OFFLINE',
	'HYBRID');

-- DROP TYPE public."enrollment_status";

CREATE TYPE public."enrollment_status" AS ENUM (
	'INTERESTED',
	'REGISTERED',
	'IN_PROGRESS',
	'COMPLETED',
	'CANCELLED');

-- DROP TYPE public."payment_status";

CREATE TYPE public."payment_status" AS ENUM (
	'UNPAID',
	'PAID',
	'PARTIAL',
	'REFUNDED');

-- DROP TYPE public."publish_status";

CREATE TYPE public."publish_status" AS ENUM (
	'DRAFT',
	'PUBLISHED',
	'ARCHIVED');

-- DROP SEQUENCE public.about_me_about_id_seq;

CREATE SEQUENCE public.about_me_about_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.about_me_about_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.about_me_about_id_seq TO "admin";

-- DROP SEQUENCE public.about_me_about_id_seq1;

CREATE SEQUENCE public.about_me_about_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.about_me_about_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.about_me_about_id_seq1 TO "admin";

-- DROP SEQUENCE public.branch_branch_id_seq;

CREATE SEQUENCE public.branch_branch_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.branch_branch_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.branch_branch_id_seq TO "admin";

-- DROP SEQUENCE public.category_id_seq;

CREATE SEQUENCE public.category_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.category_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.category_id_seq TO "admin";

-- DROP SEQUENCE public.comment_comment_id_seq;

CREATE SEQUENCE public.comment_comment_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.comment_comment_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.comment_comment_id_seq TO "admin";

-- DROP SEQUENCE public.comment_comment_id_seq1;

CREATE SEQUENCE public.comment_comment_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.comment_comment_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.comment_comment_id_seq1 TO "admin";

-- DROP SEQUENCE public.commitment_commitment_id_seq;

CREATE SEQUENCE public.commitment_commitment_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.commitment_commitment_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.commitment_commitment_id_seq TO "admin";

-- DROP SEQUENCE public.commitment_commitment_id_seq1;

CREATE SEQUENCE public.commitment_commitment_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.commitment_commitment_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.commitment_commitment_id_seq1 TO "admin";

-- DROP SEQUENCE public.consultation_request_consultation_request_id_seq;

CREATE SEQUENCE public.consultation_request_consultation_request_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.consultation_request_consultation_request_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.consultation_request_consultation_request_id_seq TO "admin";

-- DROP SEQUENCE public.consultation_request_consultation_request_id_seq1;

CREATE SEQUENCE public.consultation_request_consultation_request_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.consultation_request_consultation_request_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.consultation_request_consultation_request_id_seq1 TO "admin";

-- DROP SEQUENCE public.course_course_id_seq;

CREATE SEQUENCE public.course_course_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.course_course_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.course_course_id_seq TO "admin";

-- DROP SEQUENCE public.course_course_id_seq1;

CREATE SEQUENCE public.course_course_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.course_course_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.course_course_id_seq1 TO "admin";

-- DROP SEQUENCE public.enrollment_enrollment_id_seq;

CREATE SEQUENCE public.enrollment_enrollment_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.enrollment_enrollment_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.enrollment_enrollment_id_seq TO "admin";

-- DROP SEQUENCE public.enrollment_enrollment_id_seq1;

CREATE SEQUENCE public.enrollment_enrollment_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.enrollment_enrollment_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.enrollment_enrollment_id_seq1 TO "admin";

-- DROP SEQUENCE public.knowledge_knowledge_id_seq;

CREATE SEQUENCE public.knowledge_knowledge_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.knowledge_knowledge_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.knowledge_knowledge_id_seq TO "admin";

-- DROP SEQUENCE public.knowledge_knowledge_id_seq1;

CREATE SEQUENCE public.knowledge_knowledge_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.knowledge_knowledge_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.knowledge_knowledge_id_seq1 TO "admin";

-- DROP SEQUENCE public.news_news_id_seq;

CREATE SEQUENCE public.news_news_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.news_news_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.news_news_id_seq TO "admin";

-- DROP SEQUENCE public.news_news_id_seq1;

CREATE SEQUENCE public.news_news_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.news_news_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.news_news_id_seq1 TO "admin";

-- DROP SEQUENCE public.permission_permission_id_seq;

CREATE SEQUENCE public.permission_permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.permission_permission_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.permission_permission_id_seq TO "admin";

-- DROP SEQUENCE public.permission_permission_id_seq1;

CREATE SEQUENCE public.permission_permission_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.permission_permission_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.permission_permission_id_seq1 TO "admin";

-- DROP SEQUENCE public.refresh_token_id_seq;

CREATE SEQUENCE public.refresh_token_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.refresh_token_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.refresh_token_id_seq TO "admin";

-- DROP SEQUENCE public.refresh_token_id_seq1;

CREATE SEQUENCE public.refresh_token_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.refresh_token_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.refresh_token_id_seq1 TO "admin";

-- DROP SEQUENCE public.review_review_id_seq;

CREATE SEQUENCE public.review_review_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.review_review_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.review_review_id_seq TO "admin";

-- DROP SEQUENCE public.review_review_id_seq1;

CREATE SEQUENCE public.review_review_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.review_review_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.review_review_id_seq1 TO "admin";

-- DROP SEQUENCE public.role_role_id_seq;

CREATE SEQUENCE public.role_role_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.role_role_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.role_role_id_seq TO "admin";

-- DROP SEQUENCE public.role_role_id_seq1;

CREATE SEQUENCE public.role_role_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.role_role_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.role_role_id_seq1 TO "admin";

-- DROP SEQUENCE public.student_student_id_seq;

CREATE SEQUENCE public.student_student_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.student_student_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.student_student_id_seq TO "admin";

-- DROP SEQUENCE public.student_student_id_seq1;

CREATE SEQUENCE public.student_student_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.student_student_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.student_student_id_seq1 TO "admin";

-- DROP SEQUENCE public.tag_tag_id_seq;

CREATE SEQUENCE public.tag_tag_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.tag_tag_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.tag_tag_id_seq TO "admin";

-- DROP SEQUENCE public.teacher_teacher_id_seq;

CREATE SEQUENCE public.teacher_teacher_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.teacher_teacher_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.teacher_teacher_id_seq TO "admin";

-- DROP SEQUENCE public.teacher_teacher_id_seq1;

CREATE SEQUENCE public.teacher_teacher_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.teacher_teacher_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.teacher_teacher_id_seq1 TO "admin";

-- DROP SEQUENCE public.user_user_id_seq;

CREATE SEQUENCE public.user_user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_user_id_seq OWNER TO "admin";
GRANT ALL ON SEQUENCE public.user_user_id_seq TO "admin";

-- DROP SEQUENCE public.user_user_id_seq1;

CREATE SEQUENCE public.user_user_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_user_id_seq1 OWNER TO "admin";
GRANT ALL ON SEQUENCE public.user_user_id_seq1 TO "admin";
-- public.about_me definition

-- Drop table

-- DROP TABLE public.about_me;

CREATE TABLE public.about_me ( about_id serial4 NOT NULL, title varchar(255) NULL, description text NULL, mission text NULL, vision text NULL, email varchar(255) NULL, phone varchar(50) NULL, hotline varchar(50) NULL, website varchar(255) NULL, address text NULL, facebook_url varchar(255) NULL, zalo_url varchar(255) NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, category varchar(25) NULL, map_url text NULL, tiktok_url varchar(255) NULL, youtube_url varchar(255) NULL, CONSTRAINT about_me_pkey PRIMARY KEY (about_id));

-- Permissions

ALTER TABLE public.about_me OWNER TO "admin";
GRANT ALL ON TABLE public.about_me TO "admin";


-- public.course definition

-- Drop table

-- DROP TABLE public.course;

CREATE TABLE public.course ( course_id serial4 NOT NULL, course_code varchar(50) NULL, course_name varchar(255) NOT NULL, slug varchar(255) NULL, short_description text NULL, description text NULL, "level" public."course_level" DEFAULT 'BEGINNER'::course_level NOT NULL, "mode" public."course_mode" DEFAULT 'ONLINE'::course_mode NOT NULL, "language" varchar(50) DEFAULT 'en'::character varying NULL, price numeric(12, 2) DEFAULT 0 NULL, duration_hours int4 NULL, start_date date NULL, end_date date NULL, image_url text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, category public."course_category" DEFAULT 'BASIS'::course_category NULL, CONSTRAINT course_course_code_key UNIQUE (course_code), CONSTRAINT course_pkey PRIMARY KEY (course_id), CONSTRAINT course_slug_key UNIQUE (slug));
CREATE INDEX idx_course_level ON public.course USING btree (level);
CREATE INDEX idx_course_mode ON public.course USING btree (mode);
CREATE INDEX idx_course_slug ON public.course USING btree (slug);

-- Permissions

ALTER TABLE public.course OWNER TO "admin";
GRANT ALL ON TABLE public.course TO "admin";


-- public."permission" definition

-- Drop table

-- DROP TABLE public."permission";

CREATE TABLE public."permission" ( permission_id serial4 NOT NULL, permission_name varchar(50) NOT NULL, permission_description text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT permission_permission_name_key UNIQUE (permission_name), CONSTRAINT permission_pkey PRIMARY KEY (permission_id));

-- Permissions

ALTER TABLE public."permission" OWNER TO "admin";
GRANT ALL ON TABLE public."permission" TO "admin";


-- public.refresh_token definition

-- Drop table

-- DROP TABLE public.refresh_token;

CREATE TABLE public.refresh_token ( id serial4 NOT NULL, user_id int4 NOT NULL, jti varchar(100) NOT NULL, token_hash varchar(255) NOT NULL, session_id uuid NOT NULL, device_name varchar(100) NULL, user_agent text NULL, ip varchar(45) NULL, expires_at timestamp NOT NULL, last_used_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, revoked_at timestamp NULL, replaced_by_jti varchar(100) NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT refresh_token_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.refresh_token OWNER TO "admin";
GRANT ALL ON TABLE public.refresh_token TO "admin";


-- public."role" definition

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" ( role_id serial4 NOT NULL, role_name varchar(50) NOT NULL, role_description text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT role_pkey PRIMARY KEY (role_id), CONSTRAINT role_role_name_key UNIQUE (role_name));

-- Permissions

ALTER TABLE public."role" OWNER TO "admin";
GRANT ALL ON TABLE public."role" TO "admin";


-- public.tag definition

-- Drop table

-- DROP TABLE public.tag;

CREATE TABLE public.tag ( tag_id serial4 NOT NULL, "name" varchar(100) NOT NULL, description text NULL, slug varchar(150) NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT tag_name_key UNIQUE (name), CONSTRAINT tag_pkey PRIMARY KEY (tag_id), CONSTRAINT tag_slug_key UNIQUE (slug));

-- Permissions

ALTER TABLE public.tag OWNER TO "admin";
GRANT ALL ON TABLE public.tag TO "admin";


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" ( user_id serial4 NOT NULL, username varchar(50) NOT NULL, "password" varchar(255) NOT NULL, email varchar(100) NOT NULL, full_name varchar(100) NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, avatar varchar(50) NULL, is_active bool DEFAULT true NULL, CONSTRAINT user_email_key UNIQUE (email), CONSTRAINT user_pkey PRIMARY KEY (user_id), CONSTRAINT user_username_key UNIQUE (username));

-- Permissions

ALTER TABLE public."user" OWNER TO "admin";
GRANT ALL ON TABLE public."user" TO "admin";


-- public.category definition

-- Drop table

-- DROP TABLE public.category;

CREATE TABLE public.category ( category_id int8 DEFAULT nextval('category_id_seq'::regclass) NOT NULL, icon text NULL, "name" varchar(200) NOT NULL, slug varchar(200) NOT NULL, description text NULL, parent_id int8 NULL, category_type varchar(50) NOT NULL, meta_title varchar(255) NULL, meta_description text NULL, h1_heading varchar(255) NULL, seo_content_top text NULL, seo_content_bottom text NULL, canonical_url text NULL, noindex bool DEFAULT false NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT category_pkey PRIMARY KEY (category_id), CONSTRAINT category_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.category(category_id) ON DELETE SET NULL);

-- Permissions

ALTER TABLE public.category OWNER TO "admin";
GRANT ALL ON TABLE public.category TO "admin";


-- public.commitment definition

-- Drop table

-- DROP TABLE public.commitment;

CREATE TABLE public.commitment ( commitment_id serial4 NOT NULL, title varchar(255) NOT NULL, "content" text NULL, is_active bool DEFAULT true NULL, priority int4 DEFAULT 0 NULL, course_id int4 NULL, effective_from date NULL, effective_to date NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT commitment_pkey PRIMARY KEY (commitment_id), CONSTRAINT commitment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE SET NULL);
CREATE INDEX idx_commitment_active ON public.commitment USING btree (is_active);
CREATE INDEX idx_commitment_course ON public.commitment USING btree (course_id);

-- Permissions

ALTER TABLE public.commitment OWNER TO "admin";
GRANT ALL ON TABLE public.commitment TO "admin";


-- public.consultation_request definition

-- Drop table

-- DROP TABLE public.consultation_request;

CREATE TABLE public.consultation_request ( consultation_request_id serial4 NOT NULL, full_name varchar(255) NOT NULL, email varchar(255) NOT NULL, phone varchar(30) NULL, course_id int4 NULL, message text NULL, "contact_method" public."contact_method" NULL, status public."consult_status" DEFAULT 'PENDING'::consult_status NOT NULL, preferred_time timestamp NULL, "source" varchar(50) NULL, assigned_to int4 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT consultation_request_pkey PRIMARY KEY (consultation_request_id), CONSTRAINT consultation_request_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public."user"(user_id) ON DELETE SET NULL, CONSTRAINT consultation_request_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE SET NULL);
CREATE INDEX idx_consult_course ON public.consultation_request USING btree (course_id);
CREATE INDEX idx_consult_status ON public.consultation_request USING btree (status);

-- Permissions

ALTER TABLE public.consultation_request OWNER TO "admin";
GRANT ALL ON TABLE public.consultation_request TO "admin";


-- public.knowledge definition

-- Drop table

-- DROP TABLE public.knowledge;

CREATE TABLE public.knowledge ( knowledge_id serial4 NOT NULL, title varchar(255) NOT NULL, slug varchar(255) NOT NULL, "content" text NOT NULL, image text NULL, status public."publish_status" DEFAULT 'DRAFT'::publish_status NOT NULL, published_at timestamp NULL, author_id int4 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, category_id int4 NULL, description text NULL, is_prominent int4 DEFAULT 0 NULL, CONSTRAINT knowledge_pkey PRIMARY KEY (knowledge_id), CONSTRAINT knowledge_slug_key UNIQUE (slug), CONSTRAINT knowledge_author_id_fkey FOREIGN KEY (author_id) REFERENCES public."user"(user_id) ON DELETE SET NULL);
CREATE INDEX idx_knowledge_published_at ON public.knowledge USING btree (published_at);
CREATE INDEX idx_knowledge_status ON public.knowledge USING btree (status);

-- Permissions

ALTER TABLE public.knowledge OWNER TO "admin";
GRANT ALL ON TABLE public.knowledge TO "admin";


-- public.news definition

-- Drop table

-- DROP TABLE public.news;

CREATE TABLE public.news ( news_id serial4 NOT NULL, author_id int4 NULL, category_id int4 NULL, image text NULL, title varchar(255) NOT NULL, slug varchar(255) NOT NULL, description text NULL, "content" text NOT NULL, status public."publish_status" DEFAULT 'DRAFT'::publish_status NOT NULL, published_at timestamp NULL, tag_ids _int4 NULL, keywords _text DEFAULT '{}'::text[] NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT news_pkey PRIMARY KEY (news_id), CONSTRAINT news_slug_key UNIQUE (slug), CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public."user"(user_id) ON DELETE SET NULL);

-- Permissions

ALTER TABLE public.news OWNER TO "admin";
GRANT ALL ON TABLE public.news TO "admin";


-- public.role_permission definition

-- Drop table

-- DROP TABLE public.role_permission;

CREATE TABLE public.role_permission ( role_id int4 NOT NULL, permission_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT role_permission_pkey PRIMARY KEY (role_id, permission_id), CONSTRAINT role_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public."permission"(permission_id) ON DELETE CASCADE, CONSTRAINT role_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public."role"(role_id) ON DELETE CASCADE);

-- Permissions

ALTER TABLE public.role_permission OWNER TO "admin";
GRANT ALL ON TABLE public.role_permission TO "admin";


-- public.student definition

-- Drop table

-- DROP TABLE public.student;

CREATE TABLE public.student ( student_id serial4 NOT NULL, user_id int4 NOT NULL, phone varchar(30) NULL, dob date NULL, address text NULL, note text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT student_pkey PRIMARY KEY (student_id), CONSTRAINT student_user_id_key UNIQUE (user_id), CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE);

-- Permissions

ALTER TABLE public.student OWNER TO "admin";
GRANT ALL ON TABLE public.student TO "admin";


-- public.teacher definition

-- Drop table

-- DROP TABLE public.teacher;

CREATE TABLE public.teacher ( teacher_id serial4 NOT NULL, user_id int4 NOT NULL, bio text NULL, "name" varchar(100) NOT NULL, image varchar(255) NULL, overall_score numeric(3, 2) DEFAULT 0 NULL, listening_score numeric(3, 2) DEFAULT 0 NULL, speaking_score numeric(3, 2) DEFAULT 0 NULL, reading_score numeric(3, 2) DEFAULT 0 NULL, writing_score numeric(3, 2) DEFAULT 0 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT teacher_pkey PRIMARY KEY (teacher_id), CONSTRAINT teacher_user_id_key UNIQUE (user_id), CONSTRAINT teacher_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE);

-- Permissions

ALTER TABLE public.teacher OWNER TO "admin";
GRANT ALL ON TABLE public.teacher TO "admin";


-- public.user_role definition

-- Drop table

-- DROP TABLE public.user_role;

CREATE TABLE public.user_role ( user_id int4 NOT NULL, role_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT user_role_pkey PRIMARY KEY (user_id, role_id), CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public."role"(role_id) ON DELETE CASCADE, CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE);

-- Permissions

ALTER TABLE public.user_role OWNER TO "admin";
GRANT ALL ON TABLE public.user_role TO "admin";


-- public."comment" definition

-- Drop table

-- DROP TABLE public."comment";

CREATE TABLE public."comment" ( comment_id serial4 NOT NULL, user_id int4 NULL, course_id int4 NULL, news_id int4 NULL, knowledge_id int4 NULL, parent_comment_id int4 NULL, "content" text NOT NULL, is_approved bool DEFAULT true NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT comment_check CHECK ((num_nonnulls(course_id, news_id, knowledge_id) = 1)), CONSTRAINT comment_pkey PRIMARY KEY (comment_id), CONSTRAINT comment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE, CONSTRAINT comment_knowledge_id_fkey FOREIGN KEY (knowledge_id) REFERENCES public.knowledge(knowledge_id) ON DELETE CASCADE, CONSTRAINT comment_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public."comment"(comment_id) ON DELETE CASCADE, CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE SET NULL);
CREATE INDEX idx_comment_course ON public.comment USING btree (course_id);
CREATE INDEX idx_comment_knowledge ON public.comment USING btree (knowledge_id);
CREATE INDEX idx_comment_news ON public.comment USING btree (news_id);
CREATE INDEX idx_comment_parent ON public.comment USING btree (parent_comment_id);

-- Permissions

ALTER TABLE public."comment" OWNER TO "admin";
GRANT ALL ON TABLE public."comment" TO "admin";


-- public.enrollment definition

-- Drop table

-- DROP TABLE public.enrollment;

CREATE TABLE public.enrollment ( enrollment_id serial4 NOT NULL, student_id int4 NOT NULL, course_id int4 NOT NULL, status public."enrollment_status" DEFAULT 'REGISTERED'::enrollment_status NOT NULL, "payment_status" public."payment_status" DEFAULT 'UNPAID'::payment_status NOT NULL, payment_amount numeric(12, 2) DEFAULT 0 NULL, registered_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, started_at timestamp NULL, completed_at timestamp NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT enrollment_pkey PRIMARY KEY (enrollment_id), CONSTRAINT uq_enrollment UNIQUE (student_id, course_id), CONSTRAINT enrollment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE, CONSTRAINT enrollment_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id) ON DELETE CASCADE);
CREATE INDEX idx_enrollment_course ON public.enrollment USING btree (course_id);
CREATE INDEX idx_enrollment_student ON public.enrollment USING btree (student_id);

-- Permissions

ALTER TABLE public.enrollment OWNER TO "admin";
GRANT ALL ON TABLE public.enrollment TO "admin";


-- public.review definition

-- Drop table

-- DROP TABLE public.review;

CREATE TABLE public.review ( review_id serial4 NOT NULL, course_id int4 NOT NULL, student_id int4 NOT NULL, rating int2 NOT NULL, title varchar(255) NULL, "content" text NULL, is_approved bool DEFAULT false NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, created_by varchar(50) NULL, updated_by varchar(50) NULL, "version" int4 DEFAULT 1 NULL, CONSTRAINT review_pkey PRIMARY KEY (review_id), CONSTRAINT review_rating_check CHECK (((rating >= 1) AND (rating <= 5))), CONSTRAINT uq_review UNIQUE (student_id, course_id), CONSTRAINT review_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE, CONSTRAINT review_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id) ON DELETE CASCADE);
CREATE INDEX idx_review_course ON public.review USING btree (course_id);
CREATE INDEX idx_review_student ON public.review USING btree (student_id);

-- Permissions

ALTER TABLE public.review OWNER TO "admin";
GRANT ALL ON TABLE public.review TO "admin";




-- Permissions

GRANT ALL ON SCHEMA public TO "admin";
GRANT USAGE ON SCHEMA public TO public;
ALTER DEFAULT PRIVILEGES FOR ROLE "admin" IN SCHEMA public GRANT REFERENCES, INSERT, UPDATE, DELETE, SELECT, TRUNCATE, TRIGGER ON TABLES TO "admin";
ALTER DEFAULT PRIVILEGES FOR ROLE "admin" IN SCHEMA public GRANT UPDATE, SELECT, USAGE ON SEQUENCES TO "admin";