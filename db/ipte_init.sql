-- Bảng role
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng permission
DROP TABLE IF EXISTS permission;
CREATE TABLE permission (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL,
    permission_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng user
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng user_role (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS user_role;
CREATE TABLE user_role (
    user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES role(role_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (user_id, role_id)
);

-- Bảng role_permission (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS role_permission;
CREATE TABLE role_permission (
    role_id INT REFERENCES role(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permission(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (role_id, permission_id)
);



-- =========================================================
-- ENUM helpers (tạo nếu chưa tồn tại, giá trị IN HOA)
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
    CREATE TYPE course_level AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_mode') THEN
    CREATE TYPE course_mode AS ENUM ('ONLINE','OFFLINE','HYBRID');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publish_status') THEN
    CREATE TYPE publish_status AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
    CREATE TYPE enrollment_status AS ENUM ('INTERESTED','REGISTERED','IN_PROGRESS','COMPLETED','CANCELLED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('UNPAID','PAID','PARTIAL','REFUNDED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_method') THEN
    CREATE TYPE contact_method AS ENUM ('PHONE','EMAIL','ZALO','MESSENGER','WHATSAPP','OTHER');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consult_status') THEN
    CREATE TYPE consult_status AS ENUM ('PENDING','CONTACTED','SCHEDULED','CLOSED','CONVERTED');
  END IF;
END $$;


-- =========================================================
-- 1) course: thông tin khóa học
-- =========================================================
CREATE TABLE IF NOT EXISTS course (
  course_id         SERIAL PRIMARY KEY,
  course_code       VARCHAR(50) UNIQUE,
  course_name       VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE,
  short_description TEXT,
  description       TEXT,
  level             course_level NOT NULL DEFAULT 'BEGINNER',
  mode              course_mode  NOT NULL DEFAULT 'ONLINE',
  language          VARCHAR(50)  DEFAULT 'en',
  price             NUMERIC(12,2) DEFAULT 0,
  duration_hours    INT,
  start_date        DATE,
  end_date          DATE,
  image_url         TEXT,

  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by        VARCHAR(50),
  updated_by        VARCHAR(50),
  version           INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_course_slug ON course(slug);
CREATE INDEX IF NOT EXISTS idx_course_level ON course(level);
CREATE INDEX IF NOT EXISTS idx_course_mode  ON course(mode);

-- =========================================================
-- 2) student: học viên đã đăng ký thành công
--    (liên kết với bảng user để tái sử dụng tài khoản đăng nhập)
-- =========================================================
CREATE TABLE IF NOT EXISTS student (
  student_id  SERIAL PRIMARY KEY,
  user_id     INT UNIQUE NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  phone       VARCHAR(30),
  dob         DATE,
  address     TEXT,
  note        TEXT,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1
);

-- =========================================================
-- 3) enrollment: lần ghi danh/đăng ký vào khóa học
--    (giúp quản lý trạng thái tiến độ & thanh toán)
-- =========================================================
CREATE TABLE IF NOT EXISTS enrollment (
  enrollment_id   SERIAL PRIMARY KEY,
  student_id      INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
  course_id       INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  status          enrollment_status NOT NULL DEFAULT 'REGISTERED',
  payment_status  payment_status    NOT NULL DEFAULT 'UNPAID',
  payment_amount  NUMERIC(12,2) DEFAULT 0,
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at      TIMESTAMP,
  completed_at    TIMESTAMP,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by      VARCHAR(50),
  updated_by      VARCHAR(50),
  version         INT DEFAULT 1,

  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollment_student ON enrollment(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course  ON enrollment(course_id);

-- =========================================================
-- 4) review: đánh giá của học viên về khóa học
--    (chỉ 1 review/1 học viên/1 khóa)
-- =========================================================
CREATE TABLE IF NOT EXISTS review (
  review_id   SERIAL PRIMARY KEY,
  course_id   INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  student_id  INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  content     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1,

  CONSTRAINT uq_review UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_review_course ON review(course_id);
CREATE INDEX IF NOT EXISTS idx_review_student ON review(student_id);


-- =========================================================
-- 5) consultation_request: người quan tâm / cần tư vấn
-- =========================================================
-- public.consultation_request definition

-- Drop table

-- DROP TABLE public.consultation_request;

CREATE TABLE public.consultation_request (
	consultation_request_id serial4 NOT NULL,
	full_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(30) NULL,
	course_id int4 NULL,
	message text NULL,
	"contact_method" public."contact_method" NULL,
	status public."consult_status" DEFAULT 'PENDING'::consult_status NOT NULL,
	preferred_time timestamp NULL,
	"source" varchar(50) NULL,
	assigned_to int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	created_by varchar(50) NULL,
	updated_by varchar(50) NULL,
	"version" int4 DEFAULT 1 NULL,
	CONSTRAINT consultation_request_pkey PRIMARY KEY (consultation_request_id),
	CONSTRAINT consultation_request_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public."user"(user_id) ON DELETE SET NULL,
	CONSTRAINT consultation_request_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE SET NULL
);
CREATE INDEX idx_consult_course ON public.consultation_request USING btree (course_id);
CREATE INDEX idx_consult_status ON public.consultation_request USING btree (status);


-- =========================================================
-- 6) news: tin tức tiếng Anh (SEO-friendly bằng slug)
-- =========================================================
CREATE TABLE IF NOT EXISTS news (
  news_id     SERIAL PRIMARY KEY,
  author_id   INT REFERENCES "user"(user_id) ON DELETE SET NULL,
  category_id INT,

  image         TEXT,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  content     TEXT NOT NULL,

  status      publish_status NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMP,
  tag_ids    INT[],
  keywords TEXT[] DEFAULT '{}',

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1
);

-- =========================================================
-- 7) knowledge: bài giảng/kiến thức học tiếng Anh
-- =========================================================
-- public.knowledge definition

-- Drop table

-- DROP TABLE public.knowledge;

CREATE TABLE public.knowledge (
	knowledge_id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	slug varchar(255) NOT NULL,
	"content" text NOT NULL,
	image text NULL,
	status public."publish_status" DEFAULT 'DRAFT'::publish_status NOT NULL,
	published_at timestamp NULL,
	author_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	created_by varchar(50) NULL,
	updated_by varchar(50) NULL,
	"version" int4 DEFAULT 1 NULL,
	category_id int4 NULL,
	description text NULL,
	is_prominent int4 DEFAULT 0 NULL,
	CONSTRAINT knowledge_pkey PRIMARY KEY (knowledge_id),
	CONSTRAINT knowledge_slug_key UNIQUE (slug),
	CONSTRAINT knowledge_author_id_fkey FOREIGN KEY (author_id) REFERENCES public."user"(user_id) ON DELETE SET NULL
);
CREATE INDEX idx_knowledge_published_at ON public.knowledge USING btree (published_at);
CREATE INDEX idx_knowledge_status ON public.knowledge USING btree (status);


-- =========================================================
-- 8) comment: bình luận cho course / news / knowledge
--    Dùng 3 FK nullable + CHECK để đảm bảo chỉ gắn 1 loại mục tiêu.
-- =========================================================
CREATE TABLE IF NOT EXISTS comment (
  comment_id   SERIAL PRIMARY KEY,
  user_id      INT REFERENCES "user"(user_id) ON DELETE SET NULL,
  course_id    INT REFERENCES course(course_id) ON DELETE CASCADE,
  news_id      INT REFERENCES news(news_id) ON DELETE CASCADE,
  knowledge_id INT REFERENCES knowledge(knowledge_id) ON DELETE CASCADE,
  parent_comment_id INT REFERENCES comment(comment_id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  is_approved  BOOLEAN DEFAULT TRUE,

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50),
  version      INT DEFAULT 1,

  CHECK (num_nonnulls(course_id, news_id, knowledge_id) = 1)
);

CREATE INDEX IF NOT EXISTS idx_comment_course    ON comment(course_id);
CREATE INDEX IF NOT EXISTS idx_comment_news      ON comment(news_id);
CREATE INDEX IF NOT EXISTS idx_comment_knowledge ON comment(knowledge_id);
CREATE INDEX IF NOT EXISTS idx_comment_parent    ON comment(parent_comment_id);

-- =========================================================
-- 9) about_me: thông tin doanh nghiệp / trung tâm
-- =========================================================
-- public.about_me definition

-- Drop table

-- DROP TABLE public.about_me;

CREATE TABLE public.about_me (
	about_id serial4 NOT NULL,
	title varchar(255) NULL,
	description text NULL,
	mission text NULL,
	vision text NULL,
	email varchar(255) NULL,
	phone varchar(50) NULL,
	hotline varchar(50) NULL,
	website varchar(255) NULL,
	address text NULL,
	facebook_url varchar(255) NULL,
	zalo_url varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	created_by varchar(50) NULL,
	updated_by varchar(50) NULL,
	"version" int4 DEFAULT 1 NULL,
	category varchar(25) NULL,
	map_url text NULL,
	tiktok_url varchar(255) NULL,
	youtube_url varchar(255) NULL,
	CONSTRAINT about_me_pkey PRIMARY KEY (about_id)
);

-- Tuỳ chọn (khuyến nghị): bảng chi nhánh (branch) trực thuộc about_me
CREATE TABLE IF NOT EXISTS branch (
  branch_id    SERIAL PRIMARY KEY,
  about_id     INT NOT NULL REFERENCES about_me(about_id) ON DELETE CASCADE,
  branch_name  VARCHAR(255) NOT NULL,
  address      TEXT NOT NULL,
  phone        VARCHAR(50),
  latitude     NUMERIC(10,6),
  longitude    NUMERIC(10,6),
  opening_hours JSONB,

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50),
  version      INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_branch_about ON branch(about_id);

-- =========================================================
-- 10) commitment: cam kết của trung tâm (toàn cục hoặc theo khóa)
-- =========================================================
CREATE TABLE IF NOT EXISTS commitment (
  commitment_id  SERIAL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  content        TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  priority       INT DEFAULT 0,
  course_id      INT REFERENCES course(course_id) ON DELETE SET NULL, -- null = áp dụng chung
  effective_from DATE,
  effective_to   DATE,

  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by     VARCHAR(50),
  updated_by     VARCHAR(50),
  version        INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_commitment_course ON commitment(course_id);
CREATE INDEX IF NOT EXISTS idx_commitment_active ON commitment(is_active);


CREATE TABLE IF NOT EXISTS refresh_token (
    id              serial4       NOT NULL,
    user_id         int4          NOT NULL,
    jti             varchar(100)  NOT NULL,               -- ID duy nhất cho refresh token
    token_hash      varchar(255)  NOT NULL,               -- hash của refresh token
    session_id      uuid          NOT NULL,               -- 👈 định danh phiên (ổn định cho 1 thiết bị)
    device_name     varchar(100)  NULL,                   -- tên thiết bị client tự gửi (ví dụ: iPhone 15)
    user_agent      text          NULL,                   -- User-Agent string
    ip              varchar(45)   NULL,                   -- IP (ipv4/ipv6); 45 đủ chứa cả IPv6
    expires_at      timestamp     NOT NULL,
    last_used_at    timestamp     DEFAULT CURRENT_TIMESTAMP, -- lần cuối dùng token (refresh)
    revoked_at      timestamp     NULL,
    replaced_by_jti varchar(100)  NULL,                   -- 👈 jti mới thay thế khi rotate
    created_at      timestamp     DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp     DEFAULT CURRENT_TIMESTAMP,
    created_by      varchar(50)   NULL,
    updated_by      varchar(50)   NULL,
    version         int4          DEFAULT 1,

    CONSTRAINT refresh_token_pkey PRIMARY KEY (id)
);

-- Unique constraint cho jti (đảm bảo 1 jti chỉ xuất hiện 1 lần)
CREATE UNIQUE INDEX uq_refresh_jti ON public.refresh_token (jti);

CREATE TABLE IF NOT EXISTS teacher (
    teacher_id   SERIAL PRIMARY KEY,
    user_id      INT UNIQUE NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    bio          TEXT,
    name         VARCHAR(100) NOT NULL,
    image        VARCHAR(255),
    overall_score NUMERIC(3,2) DEFAULT 0,
    listening_score NUMERIC(3,2) DEFAULT 0,
    speaking_score NUMERIC(3,2) DEFAULT 0,
    reading_score NUMERIC(3,2) DEFAULT 0,
    writing_score NUMERIC(3,2) DEFAULT 0,

    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by   VARCHAR(50),
    updated_by   VARCHAR(50),
    version      INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS category (
	category_id SERIAL PRIMARY KEY,
	icon text NULL,
	"name" varchar(200) NOT NULL,
	slug varchar(200) NOT NULL,
	description text NULL,
	parent_id int8 NULL,
	category_type varchar(50) NOT NULL,
	meta_title varchar(255) NULL,
	meta_description text NULL,
	h1_heading varchar(255) NULL,
	seo_content_top text NULL,
	seo_content_bottom text NULL,
	canonical_url text NULL,
	noindex bool DEFAULT false NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	created_by varchar(50) NULL,
	updated_by varchar(50) NULL,
	version       INT DEFAULT 1,
	CONSTRAINT category_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.category(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description   TEXT,
    slug          VARCHAR(150) UNIQUE NOT NULL,

    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by    VARCHAR(50),
    updated_by    VARCHAR(50),
    version       INT DEFAULT 1
);


-- ==========================================
-- 4. Gán quyền cho user admin
-- ==========================================
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO admin;

